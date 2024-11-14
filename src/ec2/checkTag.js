// MIT No Attribution
//
// Copyright 2023 Amazon.com, Inc. or its affiliates. All Rights Reserved
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this
// software and associated documentation files (the "Software"), to deal in the Software
// without restriction, including without limitation the rights to use, copy, modify,
// merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
// PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

//const AWS = require('aws-sdk');
//const currentRegion = process.env.AWS_REGION;
//const computeoptimizer = new AWS.ComputeOptimizer({apiVersion: '2019-11-01', region: currentRegion});
//const ec2 = new AWS.EC2({apiVersion: '2016-11-15', region: currentRegion});
//const computeoptimizer = new AWS.ComputeOptimizer({apiVersion: '2019-11-01', region: 'ap-southeast-1'});
//const ec2 = new AWS.EC2({apiVersion: '2016-11-15', region: 'ap-southeast-1'});

async function checkTag(ec2Tags, workloadTagKey, workloadTagValue){
    try{
        for(const ec2Tag in ec2Tags){
            //only update notes when EC2 instance has the tag that workload has
            if((ec2Tags[ec2Tag].Key == workloadTagKey) && (ec2Tags[ec2Tag].Value == workloadTagValue))
                return true;
        }
        return false;
        
    } catch(err){
        console.error(err);
        return err;
    }
}

module.exports.checkTag = checkTag;
