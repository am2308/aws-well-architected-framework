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
const dynamodb = new AWS.DynamoDB({ region: currentRegion });

//curl --header "Content-Type: application/json"  -d @resources/wa-ta-mapping.json -vX POST "Your API GW Endpoints"
exports.handler= async (event) => {
    // TODO implement
    try{
        const body = JSON.parse(event.body)
        // Get table name and mappings between question id in Well-Architected and checks in Trusted Advisor (Only Cost Optimization)
        const tableName = body.tableName;
        const mappings = body.mappings;

        const documentClient = new AWS.DynamoDB.DocumentClient({ service: dynamodb });
        const requestItems = [];

        mappings.forEach(mapping =>{
            requestItems.push({
                PutRequest: {
                    Item: {
                        PillarNumber: Object.values(mapping)[0],
                        PillarId: Object.values(mapping)[1],
                        QuestionTitle: Object.values(mapping)[2],
                        QuestionId: Object.values(mapping)[3],
                        ChoiceTitle: Object.values(mapping)[4],
                        ChoiceId: Object.values(mapping)[5],
                        TACheckId: Object.values(mapping)[6]
                    }
                }
            })
        });
        const params = {
            RequestItems: {
                [tableName] : requestItems
            }
        };
        // batch write to DynamoDB
        const batchwrites = await documentClient.batchWrite(params).promise();
        const response = {
                "statusCode": 200,
                "body": JSON.stringify(batchwrites),
                "isBase64Encoded": false
            };

        return response;

    } catch(err) {
        return err;
    }
}
