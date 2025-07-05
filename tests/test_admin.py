import json
from base64 import b64encode


def auth_headers(username='admin', password='password'):
    token = b64encode(f"{username}:{password}".encode()).decode()
    return {'Authorization': f'Basic {token}'}


def test_admin_config_requires_auth(test_client):
    resp = test_client.get('/admin/config')
    assert resp.status_code == 401


def test_admin_config_get_success(test_client, mocker):
    mocker.patch('functions.config_loader.get_config', return_value={'PORT': 5000, 'FOO': 'bar'})
    resp = test_client.get('/admin/config', headers=auth_headers())
    assert resp.status_code == 200
    assert b'FOO' in resp.data


def test_admin_config_post_updates(test_client, mocker):
    mocker.patch('functions.config_loader.get_config', return_value={'PORT': 5000})
    mopen = mocker.mock_open()
    mocker.patch('builtins.open', mopen)
    post_mock = mocker.patch('requests.post')
    resp = test_client.post('/admin/config', json={'A': 1}, headers=auth_headers())
    assert resp.status_code in (302, 200)
    mopen.assert_called_with('config.json', 'w')
    post_mock.assert_called_with('http://localhost:5000/api/notify_config_reload')
