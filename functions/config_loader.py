from dotenv import load_dotenv

from settings import Settings

_config = None


def load_config():
    """Load settings from disk and environment."""
    global _config
    load_dotenv()
    _config = Settings()
    return _config

def get_config():
    global _config
    if _config is None:
        return load_config()
    return _config 