import fs from "fs";

class ProductManager {
    constructor() {
        this.products = [];
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        try {
            const newProduct = {
                id: this.#getMaxId() + 1,
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            };
            const productsValues = Object.values(newProduct);
            const productCode = this.#getProductCode(newProduct.code);
            if (productsValues.includes(undefined)) {       
                console.error('Es obligatorio usar todos los campos');
            } else if (productCode) {     
                console.error('Producto repetido')
            } else {
                if (fs.existsSync('Products.json')) {
                    this.#readProducts();
                    this.products.push(newProduct);
                } else { 
                    this.products.push(newProduct);
                }
                fs.writeFileSync('Products.json', JSON.stringify(this.products));
            }
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    getProducts() {
        if (fs.existsSync('Products.json')) {
            this.#readProducts()
            console.log(this.products);
            return this.products;
        } else {
            console.log(this.products);
            return this.products;
        };
    }

    getProductById(id) {
        let productFound = false;
        this.products.forEach((product) => {
            if (product.id === id) {
                productFound = product;
            }
        })
        productFound ? console.log('This is the product: ', productFound) : console.log("Not found");
        return productFound;
    }

    updateProduct(id, newTitle, newDescription, newPrice, newThumbnail, newCode, newStock){
        this.products.forEach((product) => {
            if (product.id === id) {
                product.title = newTitle;
                product.description = newDescription;
                product.price = newPrice;
                product.thumbnail = newThumbnail;
                product.code = newCode;
                product.stock = newStock;
                console.log(this.products);
                fs.writeFileSync('Products.json', JSON.stringify(this.products))
            }
            
        })
    }

    deleteProduct(id){
        const getIndex = (element) => element.id === id;
        let search = this.products.findIndex(getIndex);
        if (search > -1) {
           this.products.splice(search, 1);
        } else {
            console.log('Fail to delete. Product not found-')
        }
        fs.writeFileSync('Products.json', JSON.stringify(this.products));
    }


    #readProducts() {
        const products = JSON.parse(fs.readFileSync('Products.json', 'utf-8'));
        this.products = products;
    }

    #getMaxId() {
        let maxId = 0;
        this.products.map((product) => {
            if (product.id > maxId) maxId = product.id;
        });
        return maxId;
    }
    #getProductCode(codeProduct) {
        return this.products.find((product) => product.code === codeProduct);
    }
}

const productManager = new ProductManager();


productManager.getProducts();
productManager.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25);
productManager.getProducts();

productManager.getProductById(1);
productManager.addProduct('segundo producto', 'Este es un producto prueba', 200, 'Sin imagen', 'cde789', 25);

productManager.updateProduct(2, 'otro nombre', 'otra descripción', 900, 'nueva imagen', 'qwe321', 50);

productManager.deleteProduct(2);
