#!/bin/bash
# Fait le rollback de la version antérieur

DIR_IDP_DEPLOY="/var/www/idprotect"
DIR_IDP_ROLLBACK="/var/www/idprotect_rollback"

STEP="######STEP"
ERROR="######ERROR:"

DIRS_ALL_GOOD=0

echo "START: Rollback launched."

echo "$STEP 0: check all directories exist first."

if [ ! -d "$DIR_IDP_DEPLOY" ]; then
	DIRS_ALL_GOOD=1
        echo "$ERROR Directory $DIR_IDP_DEPLOY is missing."
fi

if [ ! -d "$DIR_IDP_ROLLBACK" ]; then
	DIRS_ALL_GOOD=1
        echo "$ERROR Directory $DIR_IDP_ROLLBACK is missing."
fi

if [ $DIRS_ALL_GOOD -eq 0 ]; then 
	echo "$STEP 1: Stop all process PM2."
	pm2 stop all

	echo "$STEP 2: Cleaning directory /var/www/idprotect from previous deployement."
	sudo rm -rf $DIR_IDP_DEPLOY/*

	echo "$STEP 3: Moving content of directory /var/www/idprotect_rollback to /var/www/idprotect."
	sudo mv $DIR_IDP_ROLLBACK/* $DIR_IDP_DEPLOY

	echo "$STEP 4: Executing CLEAN-INSTALL-BUILD process of the application."
	cd $DIR_IDP_DEPLOY
	sudo yarn clean-install-build

	echo "$STEP 5: Launching APP IHM side with PM2."
	yarn start:app&

	echo "$STEP 6: Launching SERVER side with PM2"
	yarn start:server&
else
	echo "$ERROR Please check if directories exist before launching deploiement."
	exit 1
fi

echo "END: Success, the deploiement process is finished."
exit 0