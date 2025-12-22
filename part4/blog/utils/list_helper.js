var lodash = require('lodash');

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        if (blog.likes > 0){
            return sum + blog.likes
        }
        return sum
    }
    return blogs.reduce(reducer, 0)
} 

const favoriteBlog = (blogs) => {
    if (blogs.length === 0){
        return {}
    }

    const reducer = (prev, current) => {
        return (prev.likes > current.likes) ? prev : current;
    }

    return blogs.reduce(reducer, blogs[0])
}

const mostBlogs = (blogs) => {
    const byBlogCount = lodash.countBy(blogs, 'author')

    return Object.keys(byBlogCount).reduce((a,b) => byBlogCount[a] > byBlogCount[b] ? a : b)
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}