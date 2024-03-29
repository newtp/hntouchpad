enyo.kind({
    
    name: "reddOS.service.RedditAuthentication",
    kind: "enyo.Component",
    
    errorResponses: {
        TIMEOUT: "request timed out",
        BAD_RESPONSE: "reddit sent bad data",
    },
    
    create: function() {
        this.inherited(arguments);
        this.$.loginWebService.setTimeout(this.timeout);
        this.$.logoutWebService.setTimeout(this.timeout);
    },
    
    /***************************************************************************
     * Published Items
     */
    
    events: {
        onLoginSuccess: "",
        onLoginFailure: "",
        onLogoutSuccess: "",
        onLogoutFailure: "",
    },
    
    published: {
        timeout: 20000,
    },
    
    /***************************************************************************
     * Components
     */
    
    components: [
        
        {name: "loginWebService", 
            kind: "enyo.WebService", 
            timeout: this.timeout,
            method: "POST",
            onSuccess: "loginReturnSuccess", 
            onFailure: "loginReturnFailure",
        },
        
        {name: "logoutWebService", 
            kind: "enyo.WebService", 
            timeout: this.timeout,
            url: "http://api.ihackernews.com/login", 
            method: "POST",
            onSuccess: "logoutReturnSuccess", 
            onFailure: "logoutReturnFailure", 
        },
    ],
        
    /***************************************************************************
     * Methods
     */
    
    doLogin: function (username, password) {
        this.$.loginWebService.setUrl("http://api.ihackernews.com/login"+username);
        this.$.loginWebService.call({
            user: username,
            passwd: password,
            api_type: "json"
        });
    },
    
    loginReturnSuccess: function(inSender, inResponse) {
        if(typeof inResponse.json.errors == "undefined") {
            this.doLoginFailure(this.errorResponses.BAD_DATA);
        }
        else if(inResponse.json.errors.length == 0) {
            this.doLoginSuccess();
        } else {
            this.doLoginFailure(inResponse.json.errors[0][1]);
        }
    },
    
    loginReturnFailure: function() {
        this.doLoginFailure(this.errorResponses.TIMEOUT);
    },
    
    //
    
    doLogout: function(userhash) {
        this.$.logoutWebService.call({uh: userhash});
    },
    
    logoutReturnSuccess: function() {
        this.doLogoutSuccess();
    },
    
    logoutReturnFailure: function() {
        this.doLogoutFailure();
    },
});
