# Expose route modules as named routers
from .fields import router as fields_router
from .forms import router as forms_router
from .responses import router as responses_router

__all__ = [
    "fields_router",
    "forms_router",
    "responses_router",
]
