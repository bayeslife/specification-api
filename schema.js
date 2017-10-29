

var schema = `
type Mutation {

    # Add CFS
    createCustomerfacingservicespecification(id: String,name: String): CFS

    # Add RFS
    createResourcefacingservicespecification(id: String,name: String): RFS

    # Add Resource
    createResource(id: String,name: String): Resource

    # Add CFSRFS
    createCFSRFS(source: String,target: String): Relationship

    # Add RFSRes
    createRFSRes(source: String,target: String): Relationship
}

type Query {

      # query customer facing service specification
      customerfacingservicespecification(id: String): CFS,

      # query resource facing service specification
      resourcefacingservicespecification(id: String): RFS

      # query resource
      resource(id: String): Resource
  }

  # Customer Facing Service
  type CFS {
    id: String!,
    name: String!,
    resourcefacingservicespecifications: [RFS],
    #The CFSs that depend upon this CFS
    dependencies: [CFS],
  }

  # Resource Facing Service
  type RFS {
    id: String!,
    name: String!,
    dependencies: [RFS]
  }

  # Resource
  type Resource {
    id: String!,
    name: String!,
    hostname: String,
    ip: String,
    mostSignificantCFS: [CFS]
  }


    # Relatinoship
    type Relationship {
      source: String!,
      target: String!
    }
`;

module.exports = schema;
