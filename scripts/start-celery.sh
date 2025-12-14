#!/bin/bash
# Celery Worker and Beat startup script for Linux/Mac

echo "Starting Celery Worker..."
celery -A eldinia_nex worker --loglevel=info &
WORKER_PID=$!

sleep 3

echo "Starting Celery Beat..."
celery -A eldinia_nex beat --loglevel=info &
BEAT_PID=$!

echo ""
echo "Celery Worker (PID: $WORKER_PID) and Beat (PID: $BEAT_PID) started successfully!"
echo "To stop: kill $WORKER_PID $BEAT_PID"
