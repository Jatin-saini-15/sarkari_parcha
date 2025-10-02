#!/bin/bash

# Database backup script
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
DB_FILE="./prisma/dev.db"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Create backup
if [ -f "$DB_FILE" ]; then
    cp "$DB_FILE" "$BACKUP_DIR/dev_backup_$DATE.db"
    echo "✅ Database backed up to: $BACKUP_DIR/dev_backup_$DATE.db"
    
    # Keep only last 10 backups
    ls -t $BACKUP_DIR/dev_backup_*.db | tail -n +11 | xargs -r rm
    echo "🧹 Cleaned up old backups (keeping last 10)"
else
    echo "❌ Database file not found: $DB_FILE"
fi
