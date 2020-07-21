const queryHandler = require('./../controllers/query-handler');
const passwordHash = require('./../config/password-hash');

class RouteHandler{

	async loginRouteHandler(request, response){
		const data = {
			username : (request.body.username).toLowerCase(),
			password : request.body.password
		};
    try {
      const result = await queryHandler.getUserByUsername(data.username);
      if(result ===  null || result === undefined) {
        response.status(500).json({
          error : true,
          message : "User login failed"
        });
      } else {
        if( passwordHash.compareHash(data.password, result.password)) {
          await queryHandler.makeUserOnline(result._id);
          response.status(200).json({
            error : false,
            userId : result._id,
            message : "User login Successfull",
            role : result.role
          });
        } else {
          response.status(500).json({
            error : true,
            message : "User login failed"
          });
        }
      }
    } catch (error) {
      response.status(500).json({
        error : true,
        message : "User login failed"
      });
    }
	}

	async registerRouteHandler(request, response){
		const data = {
			username : (request.body.username).toLowerCase(),
			password : request.body.password
		};
		if(data.username === '') {
			response.status(500).json({
				error : true,
				message : "User not found"
			});
		}else if(data.password === '') {
			response.status(500).json({
				error : true,
				message : "User not found"
			});
		} else {
			try {
				data.online = 'Y' ;
        data.socketId = '' ;
        data.role = 'user';
				data.password = passwordHash.createHash(data.password);
				const result = await queryHandler.registerUser(data);
				if (result === null || result === undefined) {
					response.status(500).json({
						error : true,
						message : "User registration failed"
					});
				} else {
					response.status(200).json({
						error : false,
						userId : result.insertedId,
						message : "User registered successfully"
					});
				}
			} catch ( error ) {
				response.status(500).json({
					error : true,
					message : "Something went wrong"
				});
			}
		}
	}

	async userSessionCheckRouteHandler(request, response){
		let userId = request.body.userId;
		if (userId === '') {
			response.status(500).json({
				error : true,
				message : "User not found"
			});
		} else {
			try {
				const result = await queryHandler.userSessionCheck({ userId : userId });
				response.status(200).json({
					error : false,
					username : result.username,
					message : "User logged In"
				});
			} catch(error) {
				response.status(500).json({
					error : true,
					message : "User not logged In"
				});
			}
		}
	}

	async getMessagesRouteHandler(request, response){
		let userId = request.body.userId;
		let toUserId = request.body.toUserId;
		if (userId == '') {
			response.status(500).json({
				error : true,
				message : "UserId not found"
			});
		}else{
			try {
				const messagesResponse = await queryHandler.getMessages({
					userId:userId,
					toUserId: toUserId
				});
				response.status(200).json({
					error : false,
					messages : messagesResponse
				});
			} catch ( error ){
				response.status(500).json({
					error : true,
					messages : "User not logged In"
				});
			}
		}
	}

	routeNotFoundHandler(request, response){
		response.status(500).json({
			error : true,
			message : "Route not found"
		});
	}
}

module.exports = new RouteHandler();
