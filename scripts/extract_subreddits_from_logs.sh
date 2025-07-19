#!/bin/bash
#
# Usage: extract_subreddit_from_logs.sh [logs.csv]
#
# Outputs a list of subreddits from the logs

cat $1 | cut -d ',' -f 7 | cut -d "/" -f5 | sort | uniq
