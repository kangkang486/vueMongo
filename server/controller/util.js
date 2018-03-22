const ObjectID = require("bson-objectid");

module.exports = class Util {
  static findAll(collection, query = {}, skip, limit) {
    try {
      query = JSON.parse(query);
      query._id && (query._id = ObjectID(query._id));
    } catch (e) {
      query = {};
    }
  
    return new Promise(async (resolve, reject) => {
      const total = await collection.find(query).count();
  
      collection.find(query).skip(skip).limit(limit).toArray(function (err, docs) {
        if (err) {
          reject(err);
        } else {
          resolve({ docs, total });
        }
      })
    })
  }
  
  static findById(collection, id) {
    id = ObjectID(id);
    
    return new Promise(async (resolve, reject) => {
      collection.find({ "_id": id }).toArray((err, doc) => {
        if (err) {
          reject(err);
        } else {
          resolve(doc);
        }
      })
    })
  }
  
  static updateById(collection, newDocument) {
    newDocument = JSON.parse(JSON.stringify(newDocument));
    newDocument._id && (newDocument._id = ObjectID(newDocument._id));
  
    return new Promise(async (resolve, reject) => {
      await collection.save(newDocument).catch(err => reject(err));
      resolve('ok')
    });
  }
  
  static deleteById(collection, id) {
    return new Promise(async (resolve, reject) => {
      try {
        id = ObjectID(id);
        const result = await collection.deleteOne({"_id": id});
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  }

  static async insert(collection, document) {
    return new Promise(async (resolve, reject) => {
      try {
        document._id && (document._id = ObjectID(document._id));
        const result = await collection.insert(document);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  }
}
