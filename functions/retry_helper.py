import time
from typing import Callable, Iterable, Type


def retry_call(func: Callable, *, retries: int = 3, delay: float = 0.1,
               exceptions: Iterable[Type[BaseException]] = (Exception,),
               logger=None):
    """Call ``func`` retrying on failure."""
    for attempt in range(retries):
        try:
            return func()
        except tuple(exceptions) as exc:  # type: ignore[arg-type]
            if attempt == retries - 1:
                if logger:
                    logger.error(f"Retries exhausted: {exc}")
                raise
            if logger:
                logger.warning(f"Retry {attempt + 1}/{retries} failed: {exc}")
            time.sleep(delay)
