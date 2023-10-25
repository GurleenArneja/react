from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
from pydantic import BaseModel
import uvicorn
from bson import json_util
import json
from fastapi.middleware.cors import CORSMiddleware  # Import CORSMiddleware

app = FastAPI()

# Connect to your MongoDB database
client = MongoClient('mongodb://localhost:27017')
db = client['TPCH']
orders_collection = db['orders-10mb']
uq_collection = db['user-queries']

class CountryQuery(BaseModel):
    nation_name: str

class StageQuery(BaseModel):
    stage_id: int


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryItem(BaseModel):
    user_name: str
    query: dict

@app.post("/save-queries", response_model=QueryItem)
async def save_query(query_item: QueryItem):
    # Insert the query into the MongoDB collection
    inserted_query = uq_collection.insert_one({"user_name": query_item.user_name, "query": query_item.query})
    if inserted_query.acknowledged:
        return query_item
    else:
        raise HTTPException(status_code=500, detail="Failed to save the query")

@app.get("/get-queries")
async def get_queries(user_name: str):
    # Retrieve the last 10 queries by user_name from the capped collection
    queries = list(uq_collection.find({"user_name": user_name}, {"_id": 0}).sort([("_id", -1)]).limit(5))
    if queries:
        user_name = queries[0]["user_name"]
        queries = [q["query"] for q in queries]
        return {"user_name": user_name, "queries": queries}
    else:
        raise HTTPException(status_code=404, detail=f"No queries found for user_name: {user_name}")
    

@app.post("/get_supplier_info")
async def get_supplier_info(country_query, stage):
    nation_to_query = country_query
    stage_to_query = int(stage)-1

    # Create the aggregation pipeline
    pipeline = [
        {
            '$match': {
                'orderstatus': 'F',
                'customer_info.nation.nation_name': nation_to_query
            }
        },
        {
            '$unwind': '$lineitems'
        },
        {
            '$match': {
                'lineitems.receiptdate': {'$gt': '$lineitems.commitdate'},
            }
        },
        {
            '$group': {
                '_id': '$lineitems.partsupp.supplier_info.supplier_name',
                'numwait': {'$sum': 1}
            }
        },
        {
            '$sort': {
                'numwait': -1,
                '_id': 1
            }
        }
    ]

    if stage_to_query >= 0:
        pipeline = pipeline[:stage_to_query+1]

    # Execute the aggregation pipeline
    results = list(orders_collection.aggregate(pipeline))[:50]

    return json.loads(json_util.dumps(results))


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
