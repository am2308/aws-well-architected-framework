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
const wellarchitected = new AWS.WellArchitected({apiVersion: '2020-03-31', region: currentRegion});

async function updateNotes(event){
    try{
        const params = {
            LensAlias: 'wellarchitected', /* this lab will use only Well-Architected Framework */
            QuestionId: event.questionId, /* required */
            WorkloadId: event.workloadId, /* required and change it to your own workload*/
            Notes: event.notes,
            };
        const updateResult = await wellarchitected.updateAnswer(params).promise();
        return updateResult;

    } catch(err){
        console.error(err);
        return err;
    }
}
module.exports.updateNotes = updateNotes;
