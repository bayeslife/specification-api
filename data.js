
// There are 3 customer facing services
var cfss = [
  {id: 'cfs1', name: 'Customer Facing Service 1'},
  {id: 'cfs2', name: 'Customer Facing Service 2'},
  {id: 'cfs3', name: 'Customer Facing Service 3'}]

// There are 2 resource facing services
var rfss = [
  {id: 'rfs1', name: 'Resource Facing Service 1'},
  {id: 'rfs2', name: 'Resource Facing Service 2'}]

// There are 2 resource
  var ress = [
    {id: 'res1', name: 'Resource 1', hostname: "hostrfs1", ip: "192.168.1.2"},
    {id: 'res2', name: 'Resource 2', hostname: "hostrfs1", ip: "192.168.1.2"}]

//The cfs depend upon rfs based on the following relationships
var cfsrfss = [
  {source: 'cfs1', target: 'rfs1'},
  {source: 'cfs2', target: 'rfs2'}]

//The rfs depend upon resource based on the following relationships
var rfsress = [
  {source: 'rfs1', target: 'res1'},
  {source: 'rfs2', target: 'res2'}]

module.exports = {
    cfss,
    rfss,
    cfsrfss,
    ress,
    rfsress
}
