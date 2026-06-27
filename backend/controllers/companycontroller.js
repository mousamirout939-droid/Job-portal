import Company from '../models/company.js';

export const createCompany = async (req, res) => {
  try {
    const { name, description, website, industry, size, foundedYear, location, socialLinks } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Please provide company name' });
    }

    const existingCompany = await Company.findOne({ admin: req.user._id });
    if (existingCompany) {
      return res.status(400).json({ success: false, message: 'You already have a company profile' });
    }

    const company = await Company.create({
      name,
      description,
      website,
      industry,
      size,
      foundedYear,
      location,
      socialLinks,
      admin: req.user._id,
    });

    res.status(201).json({ success: true, company, message: 'Company created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCompanies = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    const query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const companies = await Company.find(query)
      .select('-admin')
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Company.countDocuments(query);

    res.status(200).json({
      success: true,
      companies,
      total,
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error('Get Companies Error:', error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate('admin', 'name email');

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    res.status(200).json({ success: true, company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    if (req.user.role !== 'admin' && company.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this company' });
    }

    const updatedCompany = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, company: updatedCompany, message: 'Company updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyCompany = async (req, res) => {
  try {
    const company = await Company.findOne({ admin: req.user._id }).populate('admin', 'name email');

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company profile not found' });
    }

    res.status(200).json({ success: true, company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};