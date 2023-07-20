const postCleanUpAndValidate = ({ title, textBody, userId }) => {
    return new Promise((resolve, reject) => {
      if (!title || !textBody || !userId) {
        reject("Missing Credentials!!");
      }

      if (typeof title !== "string" || typeof textBody !== "string") {
        reject("Invalid Data Type!!");
      }

      if (title.length > 100) {
        reject("Title length should be less than 100 Characters!!");
      }

      if (textBody.length > 1000) {
        reject("Text Body length should be less than 1000 Characters!!");
      }

      resolve("Created");
    });
};

module.exports = { postCleanUpAndValidate };
