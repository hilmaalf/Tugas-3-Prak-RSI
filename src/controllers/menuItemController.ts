import type { Request, Response } from 'express';
import { MenuItemService } from '../services/menuItemService.ts';

export class MenuItemController {
  constructor(private menuItemService: MenuItemService = new MenuItemService()) {}

  private handleError(res: Response, error: unknown): Response {
    if (error instanceof Error && error.message === 'MENU_ITEM_NOT_FOUND') {
      return res.status(404).json({ status: 'fail', message: 'Menu item tidak ditemukan' });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
      error: error instanceof Error ? error.message : String(error),
    });
  }

  getMenuItems = async (req: Request, res: Response): Promise<Response> => {
    try {
      const items = await this.menuItemService.getAllMenuItems();
      return res.status(200).json({ status: 'success', data: items });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  getMenuItemById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const item = await this.menuItemService.getMenuItemById(Number(req.params.id));
      return res.status(200).json({ status: 'success', data: item });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  createMenuItem = async (req: Request, res: Response): Promise<Response> => {
    try {
      const item = await this.menuItemService.createMenuItem(req.body);
      return res.status(201).json({ status: 'success', data: item });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  updateMenuItem = async (req: Request, res: Response): Promise<Response> => {
    try {
      const item = await this.menuItemService.updateMenuItem(Number(req.params.id), req.body);
      return res.status(200).json({ status: 'success', data: item });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  deleteMenuItem = async (req: Request, res: Response): Promise<Response> => {
    try {
      const item = await this.menuItemService.deleteMenuItem(Number(req.params.id));
      return res.status(200).json({ status: 'success', data: item });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}
