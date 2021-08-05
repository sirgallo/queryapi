class TrieNode {
    constructor(value) {
        this.value = value
        this.children = {}
        this.end = false
    }
}

class Trie extends TrieNode {
    constructor() {
        super(null)
    }

    get attributes() {
        return {
            value: this.value,
            children: this.children
        }
    }

    async insertWord(word) {
        const insertWordHelper = async (node, str) => {
            return await new Promise(resolve => {
                //console.log(str[0])
                if(!node.children[str[0]]) {
                    node.children[str[0]] = new TrieNode(str[0])
                    
                    if(str.length == 1) {
                        node.children[str[0]].end = 1
                    }
                }
    
                if(str.length > 1) {
                    insertWordHelper(node.children[str[0]], str.slice(1))
                }
    
                resolve()
            })
        }

        return await insertWordHelper(this, word)
    }

    async searchWord(word) {
        const getRemainingTree = async (word, tree) => {
            return await new Promise(resolve => {
                let node = tree
                while(word) {
                    node.children[word[0]]
                    word = word.substr(1)
                }

                resolve(node)
            })
        }

        let words = []

        const allWordsHelper = async (wordSoFar, tree) => {
            return await new Promise(resolve => {
                for(let n in tree.children) {
                    const child = tree.children[n]
                    let newStr = wordSoFar + child.value
                    if(child.endWord) {
                        words.push(newStr)
                    }

                    allWordsHelper(newStr, child)
                }

                resolve()
            })
        }

        let remainingTree = await getRemainingTree(word, this)
        if(remainingTree) {
            allWordsHelper(word, remainingTree)
        }

        return words
    }
}

module.exports = Trie