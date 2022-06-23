const aws = require('aws-sdk');
const s3 = new aws.S3();

exports.handler = async function(event, context) {
    console.log(event);
    const requestedPath = event.path.substr(1)
    console.log("Path", requestedPath);
    try {
        let data;
        const bucket =  'usama.test';
        const key = 'index.html';
        try {
                data = await s3.getObject({Bucket: bucket, Key: requestedPath }).promise();
        } catch(err) {
            
                data = await s3.getObject({Bucket: bucket, Key: key}).promise();
            }
        console.log("Data", data);
        let objectData =    data.Body.toString('utf-8');
        let baseEncoded = false

        if (data.ContentType.includes('image')){
            baseEncoded = true
            objectData = data.Body.toString('base64')
        }

        const response = {
            statusCode: 200,
            statusDescription: '200 OK',
            isBase64Encoded: baseEncoded,
            headers: { 'Content-Type': data.ContentType },
            body: objectData
        }
        context.succeed(response)
    } catch (err) {
        console.log(err)
        throw new Error(`Error getting object ${requestedPath} from your-bucket-name.`)
    }
}
