default_app_config = "marketplace.apps.MarketplaceConfig"

# Ensure signals are imported when the app is loaded. This guarantees
# the post_save handler for orders is registered.
try:
    from . import signals  # noqa: F401
except Exception:
    # don't break import if signals fail
    pass
