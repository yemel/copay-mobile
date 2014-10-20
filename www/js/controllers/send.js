angular.module('copay.controllers')

.controller('SendCtrl', function($scope, Proposals) {
  $scope.proposals = Proposals.filter({ status: Proposals.STATUS.pending });

})

.controller('ProposalCtrl', function($scope, $stateParams, Proposals) {
  $scope.proposal = Proposals.get($stateParams.proposalId);

});
