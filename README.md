# What was Ravebox? #

Ravebox was a short form video platform for sharing product reviews. It was a prototype engineered by Jay Turnbull using React, Node/Express, MongoDB and AWS Elemental Media Convert to handle video transcoding.

## What did Ravebox look like ##

Below is an animated gif of a Ravebox promotion to demonstrate what it looked like when it was live.

![Ravebox functionality](/images/ravebox_functionality.gif)

## High level overview of the technical architecture ##

Ravebox was engineered as a multi-container docker application deployed on AWS. The client application was built with React using Redux for state management. The server application was built using NodeJS with an Express server connecting to a Mongo database.

The application was hosted AWS using an Elastic Beanstalk environment. A continuous deployment system was managed using Bitbucket Pipelines.

Authentication was handled with a stateless web token architecture implemented with [Passport's](https://www.npmjs.com/package/passport) middleware.

AWS CloudWatch was used for system logging and Amplitude was used for user analytics tracking.

### How were video uploads handled? ###

When a user uploaded a video in the React client, the basic metadata was stored in the database and the video was directly uploaded to an S3 bucket in AWS. When the video completed uploading, it triggered a range of step functions to parse the video data with lambda functions, process an AWS Media Convert job to transpile the video into multiple device formats and finally trigger an AWS SNS notifcation so the database could be updated with the publicly available path of the transpiled video. 

Videos were then served behind a CDN on AWS CloudFront.

## Where are the tests? ##

There are no tests. Aaaarrgh! I didn't include any tests because the purpose of Ravebox was to create a prototype to test a hypothesis in the market. If the platform took off I would have introduced tests.

## Will this run if I attempt to build it? ##

No it won't. The AWS infrastructure to handle video uploads was decommissioned and a number of settings files aren't included.
