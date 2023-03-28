#!/bin/bash
set -e

BUILD_FOLDER=${1}
AWS_BUCKET=${2}
AWS_REGION=${3:-us-east-1}
AWS_PROFILE=${4:-default}
INDEX_DOC=${5:-index.html}
ERROR_DOC=${6:-index.html}

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
echo "INDEX_DOC=$INDEX_DOC"
echo ""

# echo "Create $AWS_BUCKET"
# aws s3 mb s3://$AWS_BUCKET --profile $AWS_PROFILE --region $AWS_REGION
# echo ""

# echo "List buckets"
# aws s3 ls --profile $AWS_PROFILE
# echo ""

echo "Copy build from $BUILD_FOLDER to AWS S3 Bucket $AWS_BUCKET"
aws s3 sync --delete --acl public-read $BUILD_FOLDER s3://$AWS_BUCKET --profile $AWS_PROFILE
echo ""

echo "Publish the website"
aws s3 website s3://$AWS_BUCKET --index-document $INDEX_DOC --error-document $ERROR_DOC --profile $AWS_PROFILE
echo ""


echo "Attach policy"
JSON_FMT='{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowPublicReadAccess",
      "Effect": "Allow",
      "Principal": "*",
      "Action": [
        "s3:GetObject"
      ],
      "Resource": [
        "arn:aws:s3:::%s/*"
      ]
    }
  ]
}
'
printf "$JSON_FMT" "$AWS_BUCKET" > /tmp/aws-s3-policy.json
cat /tmp/aws-s3-policy.json
aws s3api put-bucket-policy --bucket $AWS_BUCKET --policy file:///tmp/aws-s3-policy.json --profile $AWS_PROFILE
echo ""

echo "Website deployed http://$AWS_BUCKET.s3-website-${AWS_REGION}.amazonaws.com"
