//* Importing ExecSync from "child_process" *//
const { execSync } = require('child_process')

//* Importing Axios *//
const axios = require('axios')

//* Importing OS *//
const os = require('os')

//* Import FS *//
const fs = require("fs")

//* KeyAuth Class *//
class KeyAuth {
  /**
     * @param {string} [name] - The name of the application
     * @param {string} [ownerId] - The ownerId of the application
     * @param {string} [secret] - The secret of the application
     * @param {string} [version] - The version of the application
    **/
  constructor(name, ownerId, secret, version) {
    if (!(name && ownerId && secret && version)) {
      Misc.error('Application not setup correctly.')
    }

    this.name = name
    this.ownerId = ownerId
    this.secret = secret
    this.version = version
    this.responseTime = null;
  };

  /**
     * Initializes the connection with KeyAuth in order to use any of the functions
    **/
  Initialize = () => new Promise(async (resolve) => {
    const post_data = {
      type: 'init',
      ver: this.version,
      name: this.name,
      ownerid: this.ownerId
    }

    const Json = await this.make_request(post_data)

    if (Json === 'KeyAuth_Invalid') {
      Misc.error('Invalid Application, please check your application details.')
    }

    if (!Json.success || Json.success == false) {
      return resolve(false)
    }

    this.app_data = Json.appinfo

    this.sessionid = Json.sessionid
    this.initialized = true

    resolve(true)
  })

  /**
     * Registers the user using a license and gives the user a subscription that matches their license level
     * @param {string} [username] - The username for the user
     * @param {string} [password] - The password for the user
     * @param {string} [license] - The License Key for the sub
    **/
  register = (user, password, license, email = "") => new Promise(async (resolve) => {
    this.check_initialize()

    let hwId
    if (!hwId) {
      hwId = Misc.GetCurrentHardwareId()
    }

    const post_data = {
      type: 'register',
      username: user,
      pass: password,
      email,
      key: license,
      hwid: hwId,
      sessionid: this.sessionid,
      name: this.name,
      ownerid: this.ownerId
    }

    const Json = await this.make_request(post_data)

    this.Load_Response_Struct(Json)
    if (Json.success) {
      this.Load_User_Data(Json.info)
      return resolve(Json.message)
    } else {
      Misc.error(Json.message)
    }
  })

  forgot = (username, email) => new Promise(async (resolve) => {
    this.check_initialize()

    const post_data = {
      type: 'forgot',
      username,
      email,
      sessionid: this.sessionid,
      name: this.name,
      ownerid: this.ownerId
    }

    const Json = await this.make_request(post_data)

    this.Load_Response_Struct(Json)
  });

  /**
     * Authenticates the user using their username and password
     * @param {string} [username] - The username for the user
     * @param {string} [password] - The password for the user
    **/
  login = (username, password) => new Promise(async (resolve) => {
    this.check_initialize()

    let hwId
    if (!hwId) {
      hwId = Misc.GetCurrentHardwareId()
    }

    const post_data = {
      type: 'login',
      username,
      pass: password,
      hwid: hwId,
      sessionid: this.sessionid,
      name: this.name,
      ownerid: this.ownerId
    }

    const Json = await this.make_request(post_data)

    this.Load_Response_Struct(Json)
    if (Json.success && Json.success == true) {
      this.Load_User_Data(Json.info)
      return resolve(Json)
    } else {
      Misc.error(Json.message)
    }
  })

  /**
     * Authenticate without using usernames and passwords
     * @param {string} [key] - Licence used to login with
    **/
  license = (key) => new Promise(async (resolve) => {
    this.check_initialize()

    let hwId
    if (!hwId) {
      hwId = Misc.GetCurrentHardwareId()
    }

    const post_data = {
      type: 'license',
      key,
      hwid: hwId,
      sessionid: this.sessionid,
      name: this.name,
      ownerid: this.ownerId
    }

    const Json = await this.make_request(post_data)

    this.Load_Response_Struct(Json)
    if (Json.success && Json.success == true) {
      this.Load_User_Data(Json.info)
      return resolve(Json)
    } else {
      Misc.error(Json.message)
    }
  })

  /**
     * Gives the user a subscription that has the same level as the key
     * @param {string} [username] - Username of the user thats going to get upgraded
     * @param {string} [license] - License with the same level as the subscription you want to give the user
    **/
  upgrade = (username, license) => new Promise(async (resolve) => {
    this.check_initialize()

    const post_data = {
      type: 'upgrade',
      username,
      key: license,
      sessionid: this.sessionid,
      name: this.name,
      ownerid: this.ownerId
    }

    const Json = await this.make_request(post_data)

    this.Load_Response_Struct(Json)
    if (!Json.success || Json.success == false) {
      return resolve(Json.message)
    } else {
      // Don't let them yet for dashboard.
      Misc.error(Json.message)
    }
  })

  /**
     * Gets an existing global variable
     * @param {string} [VarId] - Name of the variable / Variable ID
     * returns {string} - The value of the variable / The content of the variable
    **/
  var = (VarId) => new Promise(async (resolve) => {
    this.check_initialize()

    const post_data = {
      type: 'var',
      varid: VarId,
      sessionid: this.sessionid,
      name: this.name,
      ownerid: this.ownerId
    }

    const Json = await this.make_request(post_data)

    this.Load_Response_Struct(Json)
    if (Json.success && Json.success == true) {
      return resolve(Json)
    }

    resolve(Json.message)
  })

  /**
     * Gets the an existing user variable
     * @Param {string} [VarId] - User Variable Name
     * returns {string} - The value of the variable / The content of the user variable
    **/
  GetVar = (VarId) => new Promise(async (resolve) => {
    this.check_initialize()

    const post_data = {
      type: 'getvar',
      var: VarId,
      sessionid: this.sessionid,
      name: this.name,
      ownerid: this.ownerId
    }

    const Json = await this.make_request(post_data)

    this.Load_Response_Struct(Json)
    if (Json.success && Json.success == true) {
      return resolve(Json)
    }

    resolve(Json.message)
  })

  /**
     * Change the data of an existing user variable, *User must be logged in*
     * @Param {string} [VarId] - User variable name
     * @Param {string} [VarData] - The content of the variable
    **/
  SetVar = (VarId, VarData) => new Promise(async (resolve) => {
    this.check_initialize()

    const post_data = {
      type: 'setvar',
      var: VarId,
      data: VarData,
      sessionid: this.sessionid,
      name: this.name,
      ownerid: this.ownerId
    }

    const Json = await this.make_request(post_data)

    this.Load_Response_Struct(Json)
    if (Json.success && Json.success == true) {
      return resolve(Json)
    }

    resolve(Json.message)
  })

  /**
     * Bans the current logged in user
    **/
  ban = () => new Promise(async (resolve) => {
    this.check_initialize()

    const post_data = {
      type: 'ban',
      sessionid: this.sessionid,
      name: this.name,
      ownerid: this.ownerId
    }

    const Json = await this.make_request(post_data)

    this.Load_Response_Struct(Json)
    if (Json.success && Json.success == true) {
      return resolve(true)
    }

    resolve(Json.message)
  })

  /**
     * KeyAuth acts as proxy and downlods the file in a secure way
     * @Param {string} [fileId] - File ID
     * @Param {string} [path] - Path to save the file
     * @Param {boolean} [execute] - Execute the file after download - Windows Only Requires path for file!
     * returns {byte} - Returns The bytes of the download file
    **/
  file = (fileId, path = null, execute = false) => new Promise(async (resolve) => {
    this.check_initialize()

    const post_data = {
      type: 'file',
      fileid: fileId.toString(),
      sessionid: this.sessionid,
      name: this.name,
      ownerid: this.ownerId
    }

    const Json = await this.make_request(post_data)

    this.Load_Response_Struct(Json)
    if (Json.success && Json.success == true) {

      if (path != null) {
        var bytes = await this.strToByteArray(Json.contents);
        fs.writeFile(path, bytes, async (err) => {
          if (err) throw err;

          if (execute) {
            var exec = require('child_process').exec;
            await exec(path, function (error, stdout, stderr) {
              if (error) {
                console.error(error);
                return;
              }
            });

            return resolve(true);
          } else {
            return resolve(true);
          }
        });
      } else {
        return resolve(this.strToByteArray(Json.contents))
      }
    }

    resolve(Json.message)
  })


  /**
     * Sends a request to a webhook that you've added in the dashboard in a safe way without it being showed for example a http debugger
     * @Param {string} [webId] - Webhook ID
     * @Param {string} [Params] - Webhook Parameters
     * @Param {string} [message] - Body of the request, empty by default
     * @Param {string} [username] - Content type, empty by default
     * Returns {string} - Returns the response of the webhook
    **/
  webhook = (webId, Params, body = '', contType = '') => new Promise(async (resolve) => { // havent tested
    this.check_initialize()

    const post_data = {
      type: 'webhook',
      webid: webId,
      params: Params,
      body,
      conttype: contType,
      sessionid: this.sessionid,
      name: this.name,
      ownerid: this.ownerId
    }

    const Json = await this.make_request(post_data)

    this.Load_Response_Struct(Json)
    if (Json.success && Json.success == true) {
      return resolve(Json.response)
    }

    resolve(Json.message)
  })

  /**
     * Check if the current session is validated or not
     * Returns {string} - Returns if the session is valid or not
    **/
  check = () => new Promise(async (resolve) => {
    this.check_initialize()

    const post_data = {
      type: 'check',
      sessionid: this.sessionid,
      name: this.name,
      ownerid: this.ownerId
    }

    const Json = await this.make_request(post_data)

    this.Load_Response_Struct(Json)
    if (Json.success && Json.success == true) {
      return resolve(Json)
    };

    resolve(Json.message)
  })

  /**
     * Checks if the current IP Address/HardwareId is blacklisted
     * returns {boolean} - Returns true if the IP Address/HardwareId is blacklisted, otherwise false
    **/
  checkBlack = () => new Promise(async (resolve) => {
    this.check_initialize()

    const hwId = Misc.GetCurrentHardwareId()

    const post_data = {
      type: 'checkblacklist',
      hwid: hwId,
      sessionid: this.sessionid,
      name: this.name,
      ownerid: this.ownerId
    }

    const Json = await this.make_request(post_data)

    this.Load_Response_Struct(Json)
    if (Json.success && Json.success == true) {
      return resolve(true)
    }

    resolve(false)
  })

  /**
     * Fetch usernames of online users
     * Returns {array} - Returns an array of usernames
    **/
  fetchOnline = () => new Promise(async (resolve) => {
    this.check_initialize()

    const post_data = {
      type: 'fetchOnline',
      sessionid: this.sessionid,
      name: this.name,
      ownerid: this.ownerId
    }

    const Json = await this.make_request(post_data)

    this.Load_Response_Struct(Json)
    if (Json.success && Json.success == true) {
      return resolve(Json.users)
    } else {
      return resolve(Json.message)
    }
  })

  /**
     * Gets the last 20 sent messages of that channel
     * @param {string} [ChannelName] - The name of the channel, where you want the messages
     * Returns {array} the last 20 sent messages of that channel
    **/
  ChatGet = (ChannelName) => new Promise(async (resolve) => {
    this.check_initialize()

    const post_data = {
      type: 'chatget',
      channel: ChannelName,
      sessionid: this.sessionid,
      name: this.name,
      ownerid: this.ownerId
    }

    const Json = await this.make_request(post_data)

    this.Load_Response_Struct(Json)
    if (Json.success && Json.success == true) {
      if (Json.messages[0].message == 'not_found') {
        return resolve([])
      } else {
        return resolve(Json.messages)
      }
    } else {
      return resolve([])
    }
  })

  /**
     * Sends a message to the given channel name
     * @param {string} [ChannelName] - Channel Name where the message will be sent to
     * @param {string} [Message] - Message what will be sent to [ChannelName]
     * Returns {bool} - Returns true if the message was sent, otherwise false
    **/
  ChatSend = (ChannelName, Message) => new Promise(async (resolve) => {
    this.check_initialize()

    const post_data = {
      type: 'fetchOnline',
      message: Message,
      channel: ChannelName,
      sessionid: this.sessionid,
      name: this.name,
      ownerid: this.ownerId
    }

    const Json = await this.make_request(post_data)

    this.Load_Response_Struct(Json)
    if (Json.success && Json.success == true) {
      return resolve(true)
    } else {
      return resolve(false)
    }
  })

  /**
     * Logs the IP address,PC Name with a message, if a discord webhook is set up in the app settings, the log will get sent there and the dashboard if not set up it will only be in the dashboard
     * @param {string} [message] - Message / Discord Embed Title Message
     * Returns None
    **/
  log = (message) => new Promise(async (resolve) => {
    this.check_initialize()

    const post_data = {
      type: 'log',
      pcuser: os.userInfo().username,
      message,
      sessionid: this.sessionid,
      name: this.name,
      ownerid: this.ownerId
    }

    await this.make_request(post_data)
    resolve(true)
  })


  strToByteArray = (hex) => new Promise(async (resolve) => {
    try {
      const numberChars = hex.length;
      const bytes = new Uint8Array(numberChars / 2);
      for (let i = 0; i < numberChars; i += 2) {
        bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
      }
      resolve(bytes)
    } catch (err) {
      console.error('The session has ended, open program again.');
      process.exit(0);
    }
  })

  /**
     * Check if the current session is initialized
     * @returns [true] if client is Initialized.
    **/
  check_initialize() {
    if (!this.initialized) {
      Misc.error('You must initialize the API before using it!')
    }
    return true
  };

  /**
     * Load the response struct for Response of Request
    **/
  Load_Response_Struct(data) {
    this.response = {
      success: data.success,
      message: data.message
    }
  };

  /**
     * Load the response struct for User Data
    **/
  Load_User_Data(data) {
    this.user_data = {
      username: data.username,
      ip: data.ip,
      hwid: data.hwid,
      createdate: data.createdate,
      lastlogin: data.lastlogin,
      subscriptions: data.subscriptions
    }
  };

  /**
     * Change Console Application Title
     * @param {string} [title] - Your new Title for the App
     * Returns Promise Timeout
    **/
  setTitle(title) {
    process.stdout.write(
      String.fromCharCode(27) + ']0;' + title + String.fromCharCode(7)
    )
  };

  /**
     * Sleeping / Timeout Function
     * @param {number} [ms] - Time in milliseconds
     * Returns Promise Timeout
    **/
  sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  };

  /**
   * Request the API with the POST Data
   * @param {string} [data] - Post Data Array
   * Returns {array} - Returns the API Response [NON-ENCRYPTED]
  **/
  make_request(data) {
    const startTime = Date.now(); // Start the stopwatch

    return new Promise(async (resolve) => {
      const request = await axios({
        method: 'POST',
        url: 'https://keyauth.win/api/1.1/',
        data: new URLSearchParams(data).toString()
      }).catch((err) => {
        Misc.error(err)
      })

      const endTime = Date.now(); // Stop the stopwatch

      this.responseTime = `${endTime - startTime} ms`;

      if (request && request.data) {
        resolve(request.data)
      } else {
        resolve(null)
      };
    })
  }


}

class Misc {
  /**
     * Get the current user HardwareId
     * @returns {string} - Returns user HardwareID
    **/
  static GetCurrentHardwareId() {
    if (os.platform() != 'win32') return false

    const cmd = execSync('wmic useraccount where name="%username%" get sid').toString('utf-8')

    const system_id = cmd.split('\n')[1].trim()
    return system_id
  };

  /**
     * Error Print Function
     * @param {string} [message] - Message to Show and then exit app.
    **/
  static error(message) {
    console.log(message)
    return process.exit(0)
  }
}

/**
 * Export KeyAuth Class to be used in other files
**/
module.exports = KeyAuth
