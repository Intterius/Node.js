class APIFeatures {
  constructor(documentQuery, queryString) {
    this.documentQuery = documentQuery;
    this.queryString = queryString;
  }

  filter() {
    const queries = { ...this.queryString };
    const forbiddenFields = ['page', 'sort', 'limit', 'fields'];
    forbiddenFields.forEach((el) => delete queries[el]);

    let queryString = JSON.stringify(queries);
    queryString = JSON.parse(
      queryString.replace(/\b(lte|lt|gte|gt)\b/g, (match) => `$${match}`)
    );

    this.documentQuery = this.documentQuery.find(queryString);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      let sortBy = this.queryString.sort;
      sortBy = sortBy.split(',').join(' ');

      this.documentQuery = this.documentQuery.sort(sortBy);
    } else {
      this.documentQuery = this.documentQuery.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      let fields = this.queryString.fields.split(',').join(' ');
      this.documentQuery = this.documentQuery.select(fields);
    } else {
      this.documentQuery = this.documentQuery.select('-__v');
    }
    return this;
  }

  paginate() {
    if (this.queryString.page || this.queryString.limit) {
      let page = +this.queryString.page || 1;
      let limit = +this.queryString.limit || 100;
      let skip = (page - 1) * limit;

      this.documentQuery = this.documentQuery.skip(skip).limit(limit);
    }
    return this;
  }
}

module.exports = { APIFeatures };
