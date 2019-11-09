#!/bin/bash
#set -ex

export AWS_ACCESS_KEY_ID="AKIARU23MNJQ4XRUOS7U"
export AWS_SECRET_ACCESS_KEY="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"

aws s3 cp --recursive ./dist s3://staging.homewayz.io \
&& aws cloudfront create-invalidation --distribution-id E104YV0BXJXZQT --paths "/*"