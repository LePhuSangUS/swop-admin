default: help

env ?= staging

cnf ?= $(PWD)/.env.$(env)
include $(cnf)
export $(shell sed 's/=.*//' $(cnf))


.PHONY: help

help: ## This help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
.DEFAULT_GOAL := help

BLACK        := $(shell tput -Txterm setaf 0)
RED          := $(shell tput -Txterm setaf 1)
GREEN        := $(shell tput -Txterm setaf 2)
YELLOW       := $(shell tput -Txterm setaf 3)
LIGHTPURPLE  := $(shell tput -Txterm setaf 4)
PURPLE       := $(shell tput -Txterm setaf 5)
BLUE         := $(shell tput -Txterm setaf 6)
WHITE        := $(shell tput -Txterm setaf 7)

RESET := $(shell tput -Txterm sgr0)

# set target color
TARGET_COLOR := $(BLUE)

build: ## Build web
	@echo "${TARGET_COLOR}Build Info${RESET}";\
	build_env=$${build_env:-$(BUILD_ENV)};\
	echo "${GREEN}- Build env: $$build_env${RESET}";\
	yarn && yarn build:$$build_env

config-aws:
	@echo "${GREEN}Configure S3 ${RESET}" ;\
	aws_profile=$${aws_profile:-$(AWS_PROFILE)};\
	aws configure --profile $$aws_profile;

create-s3-bucket:
	@echo "${GREEN}Create S3 Bucket ${RESET}" ;\
	chmod +x scripts/create_s3_bucket.sh;\
	bucket=$${bucket:-$(AWS_BUCKET)};\
	build_dir=$${build_dir:-$(BUILD_DIR)};\
	aws_profile=$${aws_profile:-$(AWS_PROFILE)};\
	aws_region=$${aws_region:-$(AWS_REGION)};\
	echo "${GREEN}  - Bucket      : $$bucket ${RESET}";\
	echo "${GREEN}  - Build Dir   : $$build_dir ${RESET}";\
	echo "${GREEN}  - AWS Profile : $$aws_profile ${RESET}";\
	read -p "${GREEN}Are you sure you the configration is correct ?[y/n] default=n${RESET} " answer ;\
	answer=$${answer:-n};\
	if [ $$answer != "$${answer#[Yy]}" ] ;then\
		scripts/create_s3_bucket.sh $$build_dir $$bucket $$aws_region $$aws_profile;\
	fi;


deploy-s3-bucket:
	@echo "${GREEN}Deploy S3 Bucket ${RESET}" ;\
	chmod +x scripts/deploy_s3_bucket.sh;\
	bucket=$${bucket:-$(AWS_BUCKET)};\
	build_dir=$${build_dir:-$(BUILD_DIR)};\
	aws_profile=$${aws_profile:-$(AWS_PROFILE)};\
	aws_region=$${aws_region:-$(AWS_REGION)};\
	echo "${GREEN}  - Bucket      : $$bucket ${RESET}";\
	echo "${GREEN}  - Build Dir   : $$build_dir ${RESET}";\
	echo "${GREEN}  - AWS Profile : $$aws_profile ${RESET}";\
	read -p "${GREEN}Are you sure you the configration is correct ?[y/n] default=n${RESET} " answer ;\
	answer=$${answer:-n};\
	if [ $$answer != "$${answer#[Yy]}" ] ;then\
			scripts/deploy_s3_bucket.sh $$build_dir $$bucket $$aws_region $$aws_profile;\
	fi;\

create-bucket: ## Create bucket
	@make create-s3-bucket bucket=$(AWS_BUCKET) build_dir=$(BUILD_DIR) aws_profile=$(AWS_PROFILE) aws_region=$(AWS_REGION)

deploy:  ## Deploy to s3
	@make build
	@make publish
	@make invalidate-cloudfront > /dev/null 2>&1

publish: ## Publish to s3
	@make deploy-s3-bucket bucket=$(AWS_BUCKET) build_dir=$(BUILD_DIR) aws_profile=$(AWS_PROFILE) aws_region=$(AWS_REGION)

invalidate-cloudfront:
	aws cloudfront create-invalidation \
	--profile $(AWS_PROFILE) \
    --distribution-id $(CLOUDFRONT_DIST_ID) \
    --paths "/*"