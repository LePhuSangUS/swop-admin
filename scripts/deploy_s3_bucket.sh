#!/bin/bash
set -e

BUILD_FOLDER=${1}
AWS_BUCKET=${2}
AWS_REGION=${3:-us-east-1}
AWS_PROFILE=${4:-default}

if [ -z $AWS_BUCKET ]; then
    echo "AWS_BUCKET is required"
    exit 1
fi

if [ -z $BUILD_FOLDER ]; then
    echo "BUILD_FOLDER is required"
    exit 1
fi

echo "Deploy information"
echo "BUILD_FOLDER=$BUILD_FOLDER"
echo "AWS_BUCKET=$AWS_BUCKET"
echo "AWS_REGION=$AWS_REGION"
echo "AWS_PROFILE=$AWS_PROFILE"
echo ""

echo "Copy build from $BUILD_FOLDER to AWS S3 Bucket $AWS_BUCKET"
aws s3 sync --delete --acl public-read $BUILD_FOLDER s3://$AWS_BUCKET --profile $AWS_PROFILE
echo ""

echo "Website deployed http://$AWS_BUCKET.s3-website-${AWS_REGION}.amazonaws.com"