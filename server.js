
const express = require('express');
const cors = require('cors')
const port =  5000;



const { KmsKeyringNode, buildEncrypt, buildDecrypt } = require("@aws-crypto/client-node");


const generatorKeyId = "arn:aws:kms:ap-south-1:760572553084:key/edd378e1-a028-4a75-a3be-da023dd15176"
const keyIds = ["arn:aws:kms:ap-south-1:760572553084:key/17da3048-84c9-40d8-add7-5869c8a1658c"]

const keyring = new KmsKeyringNode({generatorKeyId, keyIds})




const context = {
    stage: "encryptdata",
    purpose: "encryptdata demo",
    origin: "ap-south-1"
  };


encryptData = async (data, context) => {
    try {
        
    const {encrypt} = buildEncrypt()
    const { result } = await encrypt(keyring, data, { encryptionContext: context });
    return result;
    } catch (e) {
    console.log(e);
    }
};

decryptData = async (encryptedData, context) => {
try {
    const {decrypt} = buildDecrypt()
  const { data, messageHeader } = await decrypt(keyring, encryptedData);
  console.log("===== Message Header =======");
  console.log(JSON.stringify(messageHeader.encryptionContext));

  Object.entries(context).forEach(([key, value]) => {
    if (messageHeader.encryptionContext[key] === value) {
      console.log("it matched..");
    }
    if (messageHeader.encryptionContext[key] !== value)
      throw new Error("Encryption Context does not match expected values");
  });

  return data.toString();
} catch (e) {
  console.log(e);
}
};


const app = express();
app.use(cors());
app.use(express.json());

  app.post('/encrypt',async(req,res) =>{
    try {
        const { data} = req.body
        let encryptedData = await encryptData(data, context);
        console.log(encryptedData);
        res.json({encryptedData})
    } catch (error) {
        console.log("ecrypting error", error);
    }
  })

  app.post('/decrypt',async(req,res) =>{
    try {
        const { encryptedData} = req.body
        let decryptedData = await decryptData(encryptedData, context);
        console.log(decryptedData);
        res.json({decryptedData})
    } catch (error) {
        console.log("decrypting error", error);
    }
  })

 


app.get('/', (req, res) => res.send("Server is ready"));

app.listen(port, () => console.log(`Server started on port ${port}`));