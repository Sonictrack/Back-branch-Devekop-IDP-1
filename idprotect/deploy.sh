#!/bin/bash
# Necessite un argument qui est le nom du fichier au format zip :
# ./deploy.sh id-protect-v.x.x.x.zip

filename=$1
USER=$(whoami)
DIR_IDP="/home/$USER/idprotect"
DIR_SOURCE="$DIR_IDP/source"
DIR_IDP_DEPLOY="/var/www/idprotect"
DIR_IDP_ROLLBACK="/var/www/idprotect_rollback"

STEP="######STEP"
ERROR="######ERROR:"

DIRS_ALL_GOOD=0

echo "START: deploiement launched."

if [ ! $filename ]; then
        echo "$ERROR The name of the file to deploy is missing as argument."
        exit 1
fi

echo "$STEP 0: check all directories exist first."

if [ ! -d "$DIR_SOURCE" ]; then
	DIRS_ALL_GOOD=1
	echo "$ERROR Directory $DIR_SOURCE is missing."
fi

if [ ! -d "$DIR_IDP_DEPLOY" ]; then
	DIRS_ALL_GOOD=1
        echo "$ERROR Directory $DIR_IDP_DEPLOY is missing."
fi

if [ ! -d "$DIR_IDP_ROLLBACK" ]; then
	DIRS_ALL_GOOD=1
        echo "$ERROR Directory $DIR_IDP_ROLLBACK is missing."
fi

if [ $DIRS_ALL_GOOD -eq 0 ]; then 
	echo "$STEP 1: Unzipping file $1."
	sudo unzip ${filename} -d $DIR_SOURCE

	echo "$STEP 2: Cleaning directory /var/www/idprotect_rollback from previous deployement."
	sudo rm -rf $DIR_IDP_ROLLBACK/*

	echo "$STEP 3: Moving content of directory /var/www/idprotect to /var/www/idprotect_rollback for rollback if necessary."
	sudo mv $DIR_IDP_DEPLOY/* $DIR_IDP_ROLLBACK

	echo "$STEP 4: Copying content of /home/tracer/idprotect/source/${filename%.*} to /var/www/idprotect."
	sudo mv $DIR_SOURCE/${filename%.*}/* $DIR_IDP_DEPLOY

	echo "$STEP 5: Deleting folder /home/tracer/idprotect/source/${filename%.*}."
	sudo rm -rf $DIR_SOURCE/${filename%.*}

	echo "$STEP 5: Executing CLEAN-INSTALL-BUILD process of the application."
	cd $DIR_IDP_DEPLOY
	sudo yarn clean-install-build

	echo "$STEP 6: Launching APP IHM side with PM2."
	yarn start:app&

	echo "$STEP 7: Launching SERVER side with PM2"
	yarn start:server&
else
	echo "$ERROR Please check if directories exist before launching deploiement."
	exit 1
fi

echo "END: Success, the deploiement process is finished."
exit 0