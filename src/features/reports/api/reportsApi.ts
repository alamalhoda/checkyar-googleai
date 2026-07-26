import axios from 'axios';
import { getMockMode } from '../../../api/client';
import type { ReportsFilters, DrilldownContext, DrilldownResult } from '../types/reports.types';
import {
  generateUserReportsData,
  generateUserChartsData,
  generateAdminReportsData,
  generateAdminChartsData,
  generateDrilldownData
} from './mockReportsData';

// REST API Base Config
const API_BASE_URL = '/api/v1';

export const reportsApi = {
  /**
   * Fetch User Reports metrics & tables
   */
  async getUserReports(filters: ReportsFilters) {
    if (getMockMode()) {
      // Simulate network delay in mock mode
      await new Promise((res) => setTimeout(res, 250));
      return generateUserReportsData(filters);
    }
    const response = await axios.get(`${API_BASE_URL}/user/reports`, { params: filters });
    return response.data;
  },

  /**
   * Fetch User Charts data
   */
  async getUserCharts(filters: ReportsFilters) {
    if (getMockMode()) {
      await new Promise((res) => setTimeout(res, 250));
      return generateUserChartsData(filters);
    }
    const response = await axios.get(`${API_BASE_URL}/user/reports/charts`, { params: filters });
    return response.data;
  },

  /**
   * Fetch Admin Reports metrics & tables
   */
  async getAdminReports(filters: ReportsFilters) {
    if (getMockMode()) {
      await new Promise((res) => setTimeout(res, 300));
      return generateAdminReportsData(filters);
    }
    const response = await axios.get(`${API_BASE_URL}/admin/reports`, { params: filters });
    return response.data;
  },

  /**
   * Fetch Admin Charts data
   */
  async getAdminCharts(filters: ReportsFilters) {
    if (getMockMode()) {
      await new Promise((res) => setTimeout(res, 300));
      return generateAdminChartsData(filters);
    }
    const response = await axios.get(`${API_BASE_URL}/admin/reports/charts`, { params: filters });
    return response.data;
  },

  /**
   * Fetch Drilldown details for a selected chart item / data point
   */
  async getDrilldown(context: DrilldownContext, filters?: ReportsFilters): Promise<DrilldownResult> {
    if (getMockMode()) {
      await new Promise((res) => setTimeout(res, 200));
      return generateDrilldownData(context);
    }
    const response = await axios.post(`${API_BASE_URL}/reports/drilldown`, {
      context,
      filters
    });
    return response.data;
  }
};
