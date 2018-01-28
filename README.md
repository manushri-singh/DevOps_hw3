# HW3
This repository contains the code for implementing Homework3 requirements of DevOps (CSC519) in Fall 2017.

## Script
main.js: https://github.ncsu.edu/manush/HW3/blob/master/main.js


## Screencasts: 
The link to access the Screencast is: https://www.youtube.com/watch?v=0Q_zuss-Xtc&feature=youtu.be

### Instructions for running the script:
1. On the machine running the application, install nodejs and npm.
2. Ensure that the server has port number 3000 free before running the application.
3. Git clone this repository, and run `npm install`.
4. Install redis and run on localhost:6379
5. Run main.js script. The command to run the script is: `node main.js`
     This script has 
     * set, get
     * upload, meow 
     * recent 
     * catfact route and caching
     * toggleCacheFeature

## Conceptual Questions: 
__1. Describe some benefits and issues related to using Feature Flags.__

Feature Flags are a typical way to implement dark launches and implementing Branching. It helps in sending the new code out faster and obtaining better feedback.

Benefits:
* Reduces Merge issues while developing code.
* Eliminates the cost required to support long living branches.
* Using Canary Releases (or other types of releases) and Feature Flags, incremental changes can be pushed, thereby reducing deployment risk by monitoring the changes closely.
* In case if the software deployed runs into errors, it is easy to turn it off using Feature Flags.

Issues:
* Supporting Branching in code becomes difficult when there are multiple features involved.
* The code becomes more fragile and brittle and more susceptible to failures as there can be many combinations that need to be evaluated. It may also result in unwanted combinations.
* The code becomes less secure, as deploying or turning off features is just based on a switch statement. It may also contain incomplete code that may be turned off and that is a technical debt.
* The code is harder to understand and maintain as the developers may not know where to fix certain bugs or errors.

__2. What are some reasons for keeping servers in seperate availability zones?__

Availability zones is basically creating pools or zones of the production environment that are isolated from other instances. They provide redundant power, cooling and networking resources.

Reasons for Availability Zones:
* Reliability — if an instance in one availability zone suffers any kind of resource outage or shortage, the other zones are available and can handle the requests. Provides better handling of failures.
* Mirroring and Disaster Recovery — can be used to mirror content of one zone, so that data backup is available incase a zone is affected.
* Allow Mission-Critical Applications to run with higher availability and fault tolerance.
* Avoiding slow spin-up — by ensuring that during peak hours the requests are mapped to the other zones. Therefore, it provides load-balancing.
* Switching requests when doing version or software changes so that is a smooth transition
* Resiliency — In case one environment (or zone) is corrupted the others are still secure. For example, in case the cache of a server in a particular zone is corrupted then servers in the other zone are still functioning properly.


__3. Describe the Circuit Breaker pattern and its relation to operation toggles.__

Circuit Breaker is a design pattern that is used to detect failures and is a valuable tool for monitoring. It contains the logic of preventing a failure from constantly recurring after a certain threshold. In other words, it is wrapping of a function behind a circuit breaker object. This object monitors for failures, and once these failures reach a particular threshold, all further calls to the circuit breaker result in an error. It helps in alerting when such a failure occurs. Any change in breaker state should be logged and should reveal details of the state for deeper monitoring. Breaker behavior is often a good source of warnings about deeper troubles in the environment.  

Operation toggles are a generalization of the circuit breaker pattern. Operation Toggles are used to control operation aspects of the system's behavior. They can be thought of as manually managed Circuit Breaker, because they can degrade the non-important functionality of the system when there is a high demand of resources (e.g. when there is a high load on a server). This provides a way for to alert the developer about an error in the system and the developer can implement the necessary changes to overcome it at a later time (when the demand for resources reduce) or in a different method.


__4. What are some ways you can help speed up an application that has__

__(a) traffic that peaks on Monday evenings__

To speed up application that has traffic peaks on Monday Evenings the application provider can set up availability zones in order to provide the service. If the provider anticipates more traffic from a particular region during this time, the data can be located in a location that is closer to the region for better response. Can also use caches to provide faster data access (rather than going to the memory especially for content that is requested more). The provider can also move the content to faster machines and reduce some load from the overloaded machines. The provider can also use proxies and load balancing for managing the network traffic.

Another solution could be to have a third party cloud provider to provide with additional resources just on the peak traffic duration hours to handle the traffic load.

__(b) real time and concurrent connections with peers__

To speed up an application that uses real time and concurrent connections with peers the following methods may be used.
* _Choosing appropriate Ports_ that are not used by other applications (and are not well-known) on the machines ensures that ISPs do not block these paths and also are not a conflicted resource. 
* _Forwarding the ports_ ensures that the incoming traffic is not blocked when the peers initiate the network connection. Access Control Lists and netfilter rules should be set appropriately to ensure that the valid port numbers for application working are not blocked. Also allow the firewall in a large datacenter to open the ports and modify the security settings to ensure that the traffic destined to particular ports are allowed.
* _Setting appropriate Upload Settings_ specially during the transmission so as to have a maximum upload capacity lesser than the total available. This is because if more upload limit is given then download speeds reduce. Another method is to ensure that there is a good ratio between the peers and resource availability.

__(c) heavy upload traffic__

There are various ways to speed up application that has heavy upload traffic. If content is needed to be used for execution of the application, a way is to upload the file or content to the disk. Once this is done, an efficient parsing code can be used and the necessary parameters and data can be sent to the application. This way the application is only involved in the later stages and therefore, application is not affected that much when upload of content to the disk is happening. If it is a large application provider, that is storing content in a huge data center, a separate server instance can be used to reduce resource locking during uploads. 


