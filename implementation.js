
var _ = require('lodash');
var assert = require('assert')

class GraphImplementation {

  constructor(solutiondata){
    this.sd = solutiondata;
  }

  getRoot(){
    var query = this;
    // The root provides the top-level API endpoints
    var root = {


      createCustomerfacingservicespecification({id,name}){
        query.sd.cfss.push({id: id,name: name});
        return new CFS(this,id,name);
      },
      createResourcefacingservicespecification({id,name}){
        query.sd.rfss.push({id: id,name: name});
        return new RFS(this,id,name);
      },
      createResource({id,name}){
        query.sd.ress.push({id: id,name: name});
        return new Resource(this,id,name);
      },
      createCFSRFS({source,target}){
        query.sd.cfsrfss.push({source: source,target: target});
        return new Relationship(this,source,target);
      },
      createRFSRes({source,target}){
        query.sd.rfsress.push({source: source,target: target});
        return new Relationship(this,source,target);
      },

      resource: function ({id}) {
        return query.getResource(id);
      },
      customerfacingservicespecification: function ({id}) {
        return query.getCFS(id);
      },
      resourcefacingservicespecification: function ({id}) {
        return query.getRFS(id);
      }
    }
    return root;
  }

  getResource(id){
    assert(id,"Id is required")
    var aps = _.find(this.sd.ress,function(res){
      if(res.id == id)
        return true;
      return false;
    })
    if(!aps)
      return null;
    return new Resource(this,aps.id,aps.name,aps.hostname,aps.ip);
  }

  getCFS(id){
    assert(id,"Id is required")
    var cfs =  _.find(this.sd.cfss,function(ps){
      if(ps.id == id)
        return true;
      return false;
    })
    if(!cfs)
      return null
    return new CFS(this,cfs.id,cfs.name);
  }

  getCFSofCFS(id){
    assert(id,"Id is required")
    var imp = this;
    var cfss = this.sd.cfss;
    var rel = _.filter(this.sd.cfscfss,function(sourcecfs){
      if(sourcecfs.source == id)
        return true;
      return false;
    })
    var ans= [];
    _.each(rel,function(cfscfs){
      var c = _.find(cfss,function(cfs){
        if(cfs.id==cfscfs.target)
           return true;
        return false;
      })
      if(c){
        var cfs = new CFS(imp,c.id,c.name)
        ans.push(cfs);
      }

    })
    return ans;
  }

  getRFSofCFS(id){
    assert(id,"Id is required")
    var cfsrfss = this.sd.cfsrfss;
    var rfss = this.sd.rfss;
    var imp = this;

    var rel = _.filter(this.sd.cfsrfss,function(cfsrfs){
      if(cfsrfs.source == id)
        return true;
      return false;
    })

    var ans= [];
    _.each(rel,function(cfsrfs){
      var c = _.find(rfss,function(rfs){
        if(rfs.id==cfsrfs.target)
           return true;
        return false;
      })
      if(c){
        var rfs = new RFS(imp,c.id,c.name);
        ans.push(rfs);
      }
    })
    return ans;
  }

  getRFS(id){
    assert(id,"Id is required")
    var rfs = _.find(this.sd.rfss,function(ps){
      if(ps.id == id)
        return true;
      return false;
    })
    if(!rfs) return null;
    return new RFS(this,rfs.id,rfs.name);
  }

  getSignificantCFS(id){
    assert(id,"Id is required")
    var cfss = this.sd.cfss;
    var cfsrfss = this.sd.cfsrfss;
    var rfsress = this.sd.rfsress;
    var rfss = this.sd.rfss;
    var imp = this;

    var rel = _.filter(this.sd.rfsress,function(rfsres){
      if(rfsres.target == id)
        return true;
      return false;
    })

    var filteredrfss = [];
    _.each(rel,function(rfsres){
      var c = _.find(rfss,function(rfs){
        if(rfs.id==rfsres.source)
           return true;
        return false;
      })
      if(c){
        filteredrfss.push(c.id);
      }
    })

    var filteredcfsrfss=[];
    _.each(filteredrfss,function(rfs){
      var c = _.find(cfsrfss,function(cfsrfs){
        if(rfs==cfsrfs.target)
           return true;
        return false;
      })
      if(c){
        filteredcfsrfss.push(c);
      }
    })

    var ans= [];
    _.each(filteredcfsrfss,function(cfsrfs){
      var c = _.find(cfss,function(cfs){
        if(cfs.id==cfsrfs.source)
           return true;
        return false;
      })
      if(c){
        var rfs = new CFS(imp,c.id,c.name);
        ans.push(rfs);
      }
    })
    return ans;
  }

}

class CFS {
  constructor(implementation,id,name) {
    this.imp = implementation
    this.id=id
    this.name=name
  }

  dependencies() {
    return this.imp.getCFSofCFS(this.id);
  }

  resourcefacingservicespecifications() {
      return this.imp.getRFSofCFS(this.id);
  }
}


class RFS {
  constructor(implementation,id,name) {
    this.imp = implementation;
    this.id=id
    this.name=name
  }

  dependencies() {
    return this.imp.getRFSofRFS(this.id);
  }
}

class Resource {
  constructor(implementation,id,name,hostname,ip) {
    this.imp = implementation;
    this.id=id
    this.hostname = hostname
    this.ip = ip
    this.name=name
  }

  mostSignificantCFS() {
    return this.imp.getSignificantCFS(this.id);
  }
}

class Relationship {
  constructor(implementation,source,target) {
    this.source = source;
    this.target=target
  }

  mostSignificantCFS() {
    return this.imp.getSignificantCFS(this.id);
  }
}

module.exports = {
  create: function(solutiondata){
    return new GraphImplementation(solutiondata);
  }
}
