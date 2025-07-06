# Mobile API Endpoints for Dream Recorder
# This module provides mobile-optimized endpoints

from flask import Blueprint, request, jsonify
from flask_socketio import emit
import os
import logging
from functions.dream_db import DreamDB
from functions.config_loader import get_config
from datetime import datetime

logger = logging.getLogger(__name__)

mobile_api = Blueprint('mobile_api', __name__, url_prefix='/api/mobile')
dream_db = DreamDB()

@mobile_api.route('/status', methods=['GET'])
def get_status():
    """Get current system status for mobile app."""
    try:
        # Get latest dream info
        dreams = dream_db.get_all_dreams()
        latest_dream = dreams[0] if dreams else None
        
        return jsonify({
            'status': 'ready',
            'latest_dream': {
                'id': latest_dream['id'] if latest_dream else None,
                'video_url': f"/media/video/{latest_dream['video_filename']}" if latest_dream else None,
                'thumb_url': f"/media/thumbs/{latest_dream['thumb_filename']}" if latest_dream else None,
                'created_at': latest_dream['created_at'] if latest_dream else None
            },
            'total_dreams': len(dreams),
            'config': {
                'max_duration': get_config()['PLAYBACK_DURATION'],
                'video_history_limit': get_config()['VIDEO_HISTORY_LIMIT']
            }
        })
    except Exception as e:
        logger.error(f"Error getting status: {str(e)}")
        return jsonify({'error': str(e)}), 500

@mobile_api.route('/dreams', methods=['GET'])
def get_dreams():
    """Get paginated list of dreams for mobile."""
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        offset = (page - 1) * limit
        
        dreams = dream_db.get_all_dreams()
        total = len(dreams)
        paginated_dreams = dreams[offset:offset + limit]
        
        # Format for mobile consumption
        formatted_dreams = []
        for dream in paginated_dreams:
            formatted_dreams.append({
                'id': dream['id'],
                'user_prompt': dream['user_prompt'],
                'generated_prompt': dream['generated_prompt'],
                'video_url': f"/media/video/{dream['video_filename']}",
                'thumb_url': f"/media/thumbs/{dream['thumb_filename']}",
                'audio_url': f"/media/audio/{dream['audio_filename']}",
                'created_at': dream['created_at'],
                'status': dream['status']
            })
        
        return jsonify({
            'dreams': formatted_dreams,
            'pagination': {
                'page': page,
                'limit': limit,
                'total': total,
                'pages': (total + limit - 1) // limit
            }
        })
    except Exception as e:
        logger.error(f"Error getting dreams: {str(e)}")
        return jsonify({'error': str(e)}), 500

@mobile_api.route('/dreams/<int:dream_id>', methods=['GET'])
def get_dream(dream_id):
    """Get specific dream details."""
    try:
        dream = dream_db.get_dream(dream_id)
        if not dream:
            return jsonify({'error': 'Dream not found'}), 404
        
        return jsonify({
            'id': dream['id'],
            'user_prompt': dream['user_prompt'],
            'generated_prompt': dream['generated_prompt'],
            'video_url': f"/media/video/{dream['video_filename']}",
            'thumb_url': f"/media/thumbs/{dream['thumb_filename']}",
            'audio_url': f"/media/audio/{dream['audio_filename']}",
            'created_at': dream['created_at'],
            'status': dream['status']
        })
    except Exception as e:
        logger.error(f"Error getting dream {dream_id}: {str(e)}")
        return jsonify({'error': str(e)}), 500

@mobile_api.route('/dreams/<int:dream_id>', methods=['DELETE'])
def delete_dream(dream_id):
    """Delete a dream (mobile optimized)."""
    try:
        success = dream_db.delete_dream(dream_id)
        if success:
            return jsonify({'message': 'Dream deleted successfully'})
        else:
            return jsonify({'error': 'Dream not found'}), 404
    except Exception as e:
        logger.error(f"Error deleting dream {dream_id}: {str(e)}")
        return jsonify({'error': str(e)}), 500

@mobile_api.route('/upload-audio', methods=['POST'])
def upload_audio():
    """Upload audio file from mobile device."""
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        audio_file = request.files['audio']
        if audio_file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Save audio file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"mobile_recording_{timestamp}.wav"
        filepath = os.path.join(get_config()['RECORDINGS_DIR'], filename)
        
        os.makedirs(get_config()['RECORDINGS_DIR'], exist_ok=True)
        audio_file.save(filepath)
        
        # Process the audio (similar to web version)
        # This would trigger the same processing pipeline
        
        return jsonify({
            'message': 'Audio uploaded successfully',
            'filename': filename,
            'processing_id': f"proc_{timestamp}"
        })
    except Exception as e:
        logger.error(f"Error uploading audio: {str(e)}")
        return jsonify({'error': str(e)}), 500

@mobile_api.route('/config', methods=['GET'])
def get_mobile_config():
    """Get mobile-specific configuration."""
    try:
        return jsonify({
            'audio': {
                'channels': get_config()['AUDIO_CHANNELS'],
                'sample_rate': get_config()['AUDIO_FRAME_RATE'],
                'sample_width': get_config()['AUDIO_SAMPLE_WIDTH']
            },
            'video': {
                'max_duration': get_config()['PLAYBACK_DURATION'],
                'history_limit': get_config()['VIDEO_HISTORY_LIMIT']
            },
            'api': {
                'websocket_url': f"ws://{get_config()['HOST']}:{get_config()['PORT']}",
                'base_url': f"http://{get_config()['HOST']}:{get_config()['PORT']}"
            }
        })
    except Exception as e:
        logger.error(f"Error getting mobile config: {str(e)}")
        return jsonify({'error': str(e)}), 500 