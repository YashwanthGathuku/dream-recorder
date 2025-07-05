import json
from pathlib import Path
from typing import Optional
from pydantic import BaseSettings

CONFIG_PATH = Path(__file__).with_name('config.json')
try:
    with CONFIG_PATH.open() as f:
        _defaults = json.load(f)
except FileNotFoundError:
    _defaults = {}

class Settings(BaseSettings):
    LOG_LEVEL: str = _defaults.get('LOG_LEVEL', 'INFO')
    DB_PATH: str = _defaults.get('DB_PATH', 'db/dreams.db')
    HOST: str = _defaults.get('HOST', '0.0.0.0')
    PORT: int = _defaults.get('PORT', 5000)
    TOTAL_BACKGROUND_IMAGES: int = _defaults.get('TOTAL_BACKGROUND_IMAGES', 0)
    CLOCK_FADE_IN_DURATION: int = _defaults.get('CLOCK_FADE_IN_DURATION', 0)
    CLOCK_FADE_OUT_DURATION: int = _defaults.get('CLOCK_FADE_OUT_DURATION', 0)
    CLOCK_CONFIG_PATH: str = _defaults.get('CLOCK_CONFIG_PATH', '')
    PLAYBACK_DURATION: int = _defaults.get('PLAYBACK_DURATION', 0)
    VIDEO_HISTORY_LIMIT: int = _defaults.get('VIDEO_HISTORY_LIMIT', 0)
    LOGO_FADE_IN_DURATION: int = _defaults.get('LOGO_FADE_IN_DURATION', 0)
    LOGO_FADE_OUT_DURATION: int = _defaults.get('LOGO_FADE_OUT_DURATION', 0)
    TRANSITION_DELAY: int = _defaults.get('TRANSITION_DELAY', 0)
    AUDIO_CHANNELS: int = _defaults.get('AUDIO_CHANNELS', 1)
    AUDIO_SAMPLE_WIDTH: int = _defaults.get('AUDIO_SAMPLE_WIDTH', 2)
    AUDIO_FRAME_RATE: int = _defaults.get('AUDIO_FRAME_RATE', 44100)
    RECORDINGS_DIR: str = _defaults.get('RECORDINGS_DIR', '')
    WHISPER_MODEL: str = _defaults.get('WHISPER_MODEL', '')
    GPT_MODEL: str = _defaults.get('GPT_MODEL', '')
    GPT_SYSTEM_PROMPT: str = _defaults.get('GPT_SYSTEM_PROMPT', '')
    GPT_SYSTEM_PROMPT_EXTEND: str = _defaults.get('GPT_SYSTEM_PROMPT_EXTEND', '')
    GPT_TEMPERATURE: float = _defaults.get('GPT_TEMPERATURE', 0.0)
    GPT_MAX_TOKENS: int = _defaults.get('GPT_MAX_TOKENS', 0)
    LUMA_API_URL: str = _defaults.get('LUMA_API_URL', '')
    LUMA_GENERATIONS_ENDPOINT: str = _defaults.get('LUMA_GENERATIONS_ENDPOINT', '')
    LUMA_EXTEND: bool = _defaults.get('LUMA_EXTEND', False)
    LUMA_MODEL: str = _defaults.get('LUMA_MODEL', '')
    LUMA_RESOLUTION: str = _defaults.get('LUMA_RESOLUTION', '')
    LUMA_DURATION: str = _defaults.get('LUMA_DURATION', '')
    LUMA_ASPECT_RATIO: str = _defaults.get('LUMA_ASPECT_RATIO', '')
    LUMA_POLL_INTERVAL: int = _defaults.get('LUMA_POLL_INTERVAL', 0)
    LUMA_MAX_POLL_ATTEMPTS: int = _defaults.get('LUMA_MAX_POLL_ATTEMPTS', 0)
    VIDEOS_DIR: str = _defaults.get('VIDEOS_DIR', '')
    THUMBS_DIR: str = _defaults.get('THUMBS_DIR', '')
    FFMPEG_BRIGHTNESS: float = _defaults.get('FFMPEG_BRIGHTNESS', 0.0)
    FFMPEG_VIBRANCE: int = _defaults.get('FFMPEG_VIBRANCE', 0)
    FFMPEG_DENOISE_THRESHOLD: int = _defaults.get('FFMPEG_DENOISE_THRESHOLD', 0)
    FFMPEG_BILATERAL_SIGMA: int = _defaults.get('FFMPEG_BILATERAL_SIGMA', 0)
    FFMPEG_NOISE_STRENGTH: int = _defaults.get('FFMPEG_NOISE_STRENGTH', 0)
    GPIO_PIN: int = _defaults.get('GPIO_PIN', 0)
    GPIO_FLASK_URL: str = _defaults.get('GPIO_FLASK_URL', '')
    GPIO_SINGLE_TAP_ENDPOINT: str = _defaults.get('GPIO_SINGLE_TAP_ENDPOINT', '')
    GPIO_DOUBLE_TAP_ENDPOINT: str = _defaults.get('GPIO_DOUBLE_TAP_ENDPOINT', '')
    GPIO_SINGLE_TAP_MAX_DURATION: float = _defaults.get('GPIO_SINGLE_TAP_MAX_DURATION', 0.0)
    GPIO_DOUBLE_TAP_MAX_INTERVAL: float = _defaults.get('GPIO_DOUBLE_TAP_MAX_INTERVAL', 0.0)
    GPIO_DEBOUNCE_TIME: float = _defaults.get('GPIO_DEBOUNCE_TIME', 0.0)
    GPIO_STARTUP_DELAY: int = _defaults.get('GPIO_STARTUP_DELAY', 0)
    GPIO_SAMPLING_RATE: float = _defaults.get('GPIO_SAMPLING_RATE', 0.0)
    OPENAI_API_KEY: Optional[str] = None
    LUMALABS_API_KEY: Optional[str] = None

    class Config:
        env_file = '.env'
        env_file_encoding = 'utf-8'

    def __getitem__(self, item):
        return getattr(self, item)

    def get(self, item, default=None):
        return getattr(self, item, default)
