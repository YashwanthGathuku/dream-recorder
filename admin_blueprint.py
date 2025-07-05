from flask import Blueprint, render_template, request, redirect, url_for, Response
from functools import wraps
import os
import json
import requests
from functions.config_loader import get_config

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

USERNAME = os.environ.get('ADMIN_USERNAME', 'admin')
PASSWORD = os.environ.get('ADMIN_PASSWORD', 'password')


def check_auth(username: str, password: str) -> bool:
    return username == USERNAME and password == PASSWORD


def authenticate() -> Response:
    return Response(
        'Authentication required', 401,
        {'WWW-Authenticate': 'Basic realm="Login Required"'}
    )


def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        if not auth or not check_auth(auth.username, auth.password):
            return authenticate()
        return f(*args, **kwargs)
    return decorated


@admin_bp.route('/config', methods=['GET', 'POST'])
@requires_auth
def config_page():
    if request.method == 'POST':
        # Determine config data
        if request.is_json:
            config_data = request.get_json(silent=True) or {}
        else:
            config_text = request.form.get('config', '{}')
            try:
                config_data = json.loads(config_text)
            except json.JSONDecodeError:
                return Response('Invalid JSON', status=400)
        # Write config.json
        with open('config.json', 'w') as f:
            json.dump(config_data, f, indent=2)
        # Notify app to reload config
        port = 5000
        try:
            port = int(get_config().get('PORT', 5000))
        except Exception:
            pass
        try:
            requests.post(f'http://localhost:{port}/api/notify_config_reload')
        except Exception:
            pass
        return redirect(url_for('admin.config_page'))

    # GET request
    try:
        config_json = json.dumps(get_config(), indent=2)
    except Exception:
        config_json = '{}'
    return render_template('admin_config.html', config=config_json)
