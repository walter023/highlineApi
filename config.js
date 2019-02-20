
export const config = {
    app: {
      port: 3000
    },
    db: {
        dbUrl: 'mongodb://highlineUser:Slackline22@highlinecluster-shard-00-00-d5zzk.mongodb.net:27017,highlinecluster-shard-00-01-d5zzk.mongodb.net:27017,highlinecluster-shard-00-02-d5zzk.mongodb.net:27017/highlineGuide?ssl=true&replicaSet=HighlineCluster-shard-0&authSource=admin&retryWrites=true'
    },
    JWT_KEY: {
      key: 'highlining'
    },
}; 
   