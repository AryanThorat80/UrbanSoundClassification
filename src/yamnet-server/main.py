from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
import io
import pandas as pd
import soundfile as sf

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

yamnet_model = tf.saved_model.load("yamnet_model/")
class_map_path = "yamnet_model/yamnet_class_map.csv"
class_names = pd.read_csv(class_map_path)["display_name"].tolist()


@app.post("/classify")
async def classify_sound(file: UploadFile = File(...)):
    audio_bytes = await file.read()

    audio, sr = sf.read(io.BytesIO(audio_bytes))
    if len(audio.shape) > 1:
        audio = np.mean(audio, axis=1) 
    if sr != 16000:
        
        import librosa
        audio = librosa.resample(audio, orig_sr=sr, target_sr=16000)
        sr = 16000

    
    scores, embeddings, spectrogram = yamnet_model(audio)
    scores_np = scores.numpy().mean(axis=0)
    top_class = np.argmax(scores_np)
    confidence = float(scores_np[top_class])

    result = {
        "class": class_names[top_class],
        "confidence": round(confidence * 100, 2),
    }

    return result

@app.get("/healthz")
def health_check():
    return {"status": "ok"}