//Dependencies
To serve this app, you need to install the required npm modules using npm install in a CLI

//MongoDB
To serve this app, you also need to deploy a MongoDB database. You can either configure it
to run in the cloud using MongoDB Atlas or run it locally using the comminuty server.
I'm assuming the configuration will be slightly different based on which you choose.

//Environment Variables//
To serve this app, you must create a .env file and populate it with the folling environment variables.
Note that you also much have the dotenv npm package installed. This should be a dependency already.

MONGODB_URI // The URI from either a Mongo Atlas deployment or a local deployment.
SECRET // Not quite sure what this does. Just generate a random string of characters and use that.

//BUGS//
 - If you don't input a name on mint crypto button, itll post a cryptro with name "null". It should cancel the mint instead
 - If your cookie expires and you try to access a protected page, it throws an error about sending headers. Benign, but should be cleaned up
 - The routing architecture is bad



//Changes//
Artwork no longer added to User until approved
Approving added timestamp to artwork, adds artwork to user who created it
Added a page with all cryptos


//Agenda//


Saved Colors
Sorting
Activity Feed
 - active auction
 - view auction/bid history
 - view future auctions (newly minted cryptos)
 - view artwork ownership transfers
Auctions
 - auction an artwork
 - bid on artwork
Running Auctions
