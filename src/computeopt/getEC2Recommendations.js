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

const AWS = require('aws-sdk');
const currentRegion = process.env.AWS_REGION;
const computeoptimizer = new AWS.ComputeOptimizer({ apiVersion: '2019-11-01', region: currentRegion });
// nosemgrep: useless-assignment
const { date } = require('../libraries/date');
// nosemgrep: useless-assignment
const { describe } = require('../ec2/describe');
// nosemgrep: useless-assignment
const { checkTag } = require('../ec2/checkTag');
// nosemgrep: useless-assignment
const queries = require('../dynamodb/queries');
// nosemgrep: useless-assignment
const { question6 , question7 } = require('../questions/costQuestion');

async function getEC2Recommendations(event) {
    try {
        //console.log("event details: ", event);
        //get the current date
        const currentDate = await date();
        const accountId = event.accountId; //AWS account ID
        const workloadId = event.workloadId //Well-Architected workload ID
        const workloadTagKey = Object.keys(event.tag)[0]; //Tag key
        const workloadTagValue = Object.values(event.tag)[0]; //Tag value
        //const questionId = 'type-size-number-resources';

        //EC2Recommendations are related to question #6 in Cost Optimization Pillar
        //Get QuestionId,TACheckId from mapping table between Trusted Advisor Checks and WA questions in DynamoDB
        //const pillarNumber = 'COST-6';
        const responses = await queries.mappingEngineQueries();
        for (const response of responses.Items) {
            const pillarNumber = response.PillarNumber;
            const pillarID = response.PillarId;
            const questionId = response.QuestionId;
            const taCheckId = response.TACheckId;

            console.log("questionID: ", questionId);
            console.log("TACheckID: ", taCheckId);
            console.log("Tag: ",workloadTagKey,workloadTagValue);

            if(questionId == 'type-size-number-resources'){
                const questio6Response = await question6(accountId, workloadId, workloadTagKey, workloadTagValue, questionId, taCheckId);
            } else if(questionId == 'pricing-model'){
                const questio7Response = await question7(accountId, workloadId, questionId, taCheckId);
            } else{
                console.log("Implementation of this question is needed.")
            }
        }
        return responses;

    }
    catch (err) {
        console.error(err);
        return err;
    }
}
module.exports.getEC2Recommendations = getEC2Recommendations;
