// implement your posts router here
const express = require('express')
const router = express.Router()
const Post = require('./posts-model')

router.get('/', async (req, res)=>{
    // res.json({message: 'TEST: get /api/posts'})
    Post.find()
        .then( found => {
            // throw new Error("ouch")
            res.status(200).json(found)
        })
        .catch( err=>{
            res.status(500).json({
                message: "The posts information could not be retrieved",
                err: err.message,
                stack: err.stack
            })
        })
})

router.get('/:id', async (req, res)=>{
    // res.json({message: 'TEST: get /api/posts/:id '})
    try{
        // throw new Error("pathetic")
        // const post = await Post.findById(100000)
        // console.log(post)
        
        const post = await Post.findById(req.params.id)
        if(!post){
            res.status(404).json({message: 'The post with the specified ID does not exist' })
        }else{
            res.status(200).json(post)
        }
       
    }catch(err){
        res.status(500).json({
            message: "The post information could not be retrieved",
            err: err.message,
            stack: err.stack
        })
    }
})

router.post('/', async (req, res)=>{
    // res.json({message: 'TEST: post /api/posts  '})
    const {title, contents} = req.body
    if(!title || !contents){
        res.status(400).json({
            message: "Please provide title and contents for the post"
        })
    }else{
        try{
            // console.log(title)
            const postId = await Post.insert(req.body)
            console.log(postId)
            const newPost = await Post.findById(postId.id)
            res.status(201).json(newPost)
        }catch(err){
            res.status(500).json({
                message: "There was an error while saving the post to the database",
                err: err.message,
                stack: err.stack
            }) 
        }
    }
})

router.delete('/:id', async (req, res)=>{
    // res.json({message: 'TEST: delete /api/posts/:id '})
  
    try{
        const passiblePost = await Post.findById(req.params.id)
        if(!passiblePost){
            res.status(404).json({message: "The post with the specified ID does not exist" })
        }else{
            const delPost = await Post.remove(passiblePost.id)
            res.status(200).json(passiblePost)
        }
    }catch(err){
        res.status(500).json({
            message: "The post could not be removed",
            err: err.message,
            stack: err.stack
        }) 
    }
})

router.put('/:id', async (req, res)=>{
    // res.json({message: 'TEST: put /api/posts/:id '})
    const {title, contents} = req.body
    try{
        const passiblePost = await Post.findById(req.params.id)
        if(!passiblePost){
            res.status(404).json({message: "The post with the specified ID does not exist" })
        }else if (!title || !contents){
            res.status(400).json({message: "Please provide title and contents for the post"})
        }else{
            const udatePost = await Post.update(req.params.id, req.body)
            const newPost = await Post.findById(req.params.id)
            res.status(200).json(newPost)
        }
    }catch(err){
        res.status(500).json({
            message: "The post information could not be modified",
            err: err.message,
            stack: err.stack
        }) 
    }
})

router.get('/:id/comments', async (req, res)=>{
    // res.json({message: 'TEST: get /api/posts/:id/messages '})
    try{
        const passiblePost = await Post.findById(req.params.id)
        console.log(passiblePost)
        if(!passiblePost){
            res.status(404).json({message: "The post with the specified ID does not exist"})
        }else{
            const message = await Post.findPostComments(req.params.id)
            res.status(200).json(message)
        }
    }catch(err){
        res.status(500).json({
            message: "The comments information could not be retrieved",
            err: err.message,
            stack: err.stack
        })  
    }
})
module.exports = router