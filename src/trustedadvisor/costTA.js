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
const support = new AWS.Support({apiVersion: '2013-04-15', region: 'us-east-1'});
// nosemgrep: useless-assignment
const { describe } = require('../ec2/describe');
// nosemgrep: useless-assignment
const { checkTag } = require('../ec2/checkTag');

async function getTAQ6( taCheckId, workloadTagKey, workloadTagValue,taCheckId){
    try{
        //console.log("questionId, taCheckId: ", questionId, taCheckId);
        let notes = '\n' + '[AWS Trusted Advisor]' + '\n';
        const id = taCheckId;
        let name = '';
        //get check's name 
        const params = {
            language: 'en',
        };
        const allChecks = await support.describeTrustedAdvisorChecks(params).promise();
        for(const check in allChecks.checks){
            if (allChecks.checks[check].id == id)
                name = allChecks.checks[check].name;
        }

        //get check results
        const checkParams = {
            checkId: id,
            language: 'en',
            };
        const response = await support.describeTrustedAdvisorCheckResult(checkParams).promise();
        
        if (response.result.status != 'ok')
            {
                const flaggedResources = response.result.flaggedResources;
                notes += name + '\n'
                let instanceDetail = 'instanceId' +'       ' + 'instanceName' +'       ' + 'instanceType' +'       ' + 'estimated Monthly Savings' +'       ' + 'averageCPUUtilization'+ '\n';

                for(const flaggedResource in flaggedResources){
                    const instanceId = flaggedResources[flaggedResource].metadata[1];
                    const instanceName = flaggedResources[flaggedResource].metadata[2];
                    const instanceType = flaggedResources[flaggedResource].metadata[3];
                    const monthlySavings = flaggedResources[flaggedResource].metadata[4];
                    const averageCPUUtilization = flaggedResources[flaggedResource].metadata[19];
                    //get all tags attached to EC2
                    const ec2Tags = await describe(instanceId);
                    //comparison between a tag of ec2 and a tag of workload in Well-Architected tool
                    const tagResult = await checkTag(ec2Tags, workloadTagKey, workloadTagValue);
                    //console.log("tagResult-TA: ", tagResult);
                    if(tagResult)
                        instanceDetail += instanceId + '  ' + instanceName + '  ' + instanceType + '  ' + monthlySavings + '  ' + averageCPUUtilization + '\n';
                }
                notes += instanceDetail
            } 
        else{
            console.log("Recommendations are not yet available.")
        }     
        return notes;
    } catch(err){
        console.error(err);
        return err;
    }
}

async function getTAQ7( taCheckId ){
    try{
        //console.log("questionId, taCheckId: ", questionId, taCheckId);
        let notes = '[AWS Trusted Advisor]'+ '\n';
        const id = taCheckId;
        let name = '';
        //get check's name 
        const params = {
            language: 'en',
        };
        const allChecks = await support.describeTrustedAdvisorChecks(params).promise();
        for(const check in allChecks.checks){
            if (allChecks.checks[check].id == id)
                name = allChecks.checks[check].name;
        }

        //get check results
        const checkParams = {
            checkId: id,
            language: 'en',
            };
        const response = await support.describeTrustedAdvisorCheckResult(checkParams).promise();
        //console.log("Cost7 response: ", response);

        if (response.result.status != 'ok')
            {
                const flaggedResources = response.result.flaggedResources;
                notes += name + '\n'
                let instanceDetail = 'region' +'       ' + 'instanceType' +'       ' + 'recommended Number Of RIs' +'       ' + 'estimated Monthly Savings' +'       ' + 'upfront Cost of RI' +'       ' + 'Terms(Years)'+ '\n';

                for(const flaggedResource in flaggedResources){
                    const region = flaggedResources[flaggedResource].metadata[0];
                    const instanceType = flaggedResources[flaggedResource].metadata[1];
                    const recommendedNumberOfRIs = flaggedResources[flaggedResource].metadata[3];
                    const estimatedMonthlySavings = flaggedResources[flaggedResource].metadata[5];
                    const upfrontCostOfRI = flaggedResources[flaggedResource].metadata[6];
                    const terms = flaggedResources[flaggedResource].metadata[11];
                    instanceDetail += region + '  ' + instanceType + '  ' + recommendedNumberOfRIs + '  ' + estimatedMonthlySavings + '  ' + upfrontCostOfRI+ '  ' + terms + '\n';
                }
                notes += instanceDetail
            }
        else{
            console.log("Pricing Model Recommendations are not yet available.")
        }   
        return notes;
    } catch(err){
        console.error(err);
        return err;
    }
}

module.exports.getTAQ6 = getTAQ6;
module.exports.getTAQ7 = getTAQ7;
