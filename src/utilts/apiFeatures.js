export class ApiFeatures {
    constructor(mongooseQuery, query) {
        this.mongooseQuery = mongooseQuery
        this.query = query
    }
    //NOTE - pagination
    paginate() {
        const limit = 5;
        //NOTE - if there is no page given or given string value 
        let page = this.query.page * 1 || 1
        //NOTE - if page value <=0
        if (page <= 0) page = 1
        const skip = (page - 1) * limit;
        this.page = page
        this.mongooseQuery.skip(skip).limit(limit)
        return this
    }

    //NOTE - filter
    filter() {
        //NOTE - deep copy
        let filterObg = { ...this.query };
        let excludedQuery = ['page', 'sort', 'fields', 'keyword'];
        excludedQuery.forEach(q => {
            delete filterObg[q];
        });
        filterObg = JSON.stringify(filterObg);
        filterObg = filterObg.replace(/(gt|gte|let|lte)/g, match => `$ ${match}`)
        filterObg = JSON.parse(filterObg);
        this.mongooseQuery.find(filterObg)
        return this
    }
    //NOTE - sort
    sort() {
        if (this.query.sort) {
            let sortedBy = this.query.sort.split(',').join(' ');
            this.mongooseQuery.sort(sortedBy);
        }
        return this
    }

    test() {
    }
    //NOTE - search
    search() {
        if (this.query.keyword) {
            this.mongooseQuery.find({
                $or: [{ title: { $regex: this.query.keyword, $options: 'i' } },
                { description: { $regex: this.query.keyword, $options: 'i' } }]
            });
        }

        return this

    }

    //NOTE - selected fields
    fields() {
        if (this.query.fields) {
            let fields = this.query.fields.split(',').join(' ');
            this.mongooseQuery.select(fields);
        }
        return this
    }

}