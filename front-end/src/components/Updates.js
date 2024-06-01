import React from 'react'

function Updates({type, content}) {
    let message = '';
    if (content.updatedAt === content.createdAt) {
        message = `New ${type} added: ${content.policyName || content.name}`
    }

    if (type === 'claim' && !content.status === 'pending') {
        message =  `Claim for ${content.policyName} ${content.status}`
    }

    if (type === 'policy' && content.active === 'false') {
        message = `Policy ${content.name} expired on ${content.updatedAt}`
    }

    if (type === 'user-policy' && content.expired === 'true') {
        message = `Your policy ${content.policyName} expired on ${content.updatedAt}`
    }

    if (type === 'user-policy' && content.expired === 'true') {
        message = `Your policy ${content.policyName} expired on ${content.updatedAt}`
    }
  return (
    <h1>{message}</h1>
  )
}

export default Updates
