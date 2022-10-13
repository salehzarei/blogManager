
var AWS = require('aws-sdk');
const region = "default"
const accessKeyId = process.env.LIARA_ACCESS_KEY
const secretAccessKey = process.env.LIARA_SECRET_KEY
const endpoint = process.env.LIARA_ENDPOINT
const bucket = process.env.LIARA_BUCKET_NAME

AWS.config.update({ endpoint: endpoint, accessKeyId: accessKeyId, secretAccessKey: secretAccessKey, region: region })
s3 = new AWS.S3({ params: { Bucket: bucket } })

s3.listBuckets(function (err, data)
{
    if (err)
    {
        console.log("Error", err);
    } else
    {
        console.log("Success", data.Buckets)
    }

})

module.exports = {

    AWS,
    s3
}


