#include "widgetManager.hpp"
#include "widget.hpp"

#include "core/engine.hpp"

void WidgetManager::reset_anchor_positions() {
    top_left_anchor_x = 0;
    top_left_anchor_y = 0;
    top_right_anchor_x = 920;
    top_right_anchor_y = 0;
    bottom_left_anchor_x = 0;
    // TODO: Not hard code this
    bottom_left_anchor_y = 720;
    bottom_right_anchor_x = 0;
    bottom_right_anchor_y = 0;
}

void WidgetManager::init() {
    // TOOD: No magic numbers
    QcE::get_instance()->getTextEngine()->createFont("widget_tiny", "resources/Courier.ttf", 12);
    QcE::get_instance()->getTextEngine()->createFont("widget_small", "resources/Courier.ttf", 16);
    QcE::get_instance()->getTextEngine()->createFont("widget_medium", "resources/Courier.ttf", 32);
    QcE::get_instance()->getTextEngine()->createFont("widget_large", "resources/Courier.ttf", 64);

    reset_anchor_positions();
}

Widget * WidgetManager::addWidget(Widget * widget) {
    widgets.push_back(widget);
    widget->define();
    widget->calculate_dim();
    return widget;
}

Widget * WidgetManager::get_widget(const std::string& name) {
    for (Widget * widget : widgets) {
        if (widget->get_name() == name) {
            return widget;
        }
    }
    return nullptr;
}

bool WidgetManager::click(int mouse_x, int mouse_y) {
    for (Widget * widget : widgets) {
        if (widget->click(mouse_x, mouse_y)) {
            return true;
        }
    }
    return false;
}

bool WidgetManager::is_mouse_over(int mouse_x, int mouse_y) const {
    for (Widget * widget : widgets) {
        if (widget->is_mouse_over(mouse_x, mouse_y)) {
            return true;
        }
    }
    return false;
}

void WidgetManager::render() {
    for (Widget * widget : widgets) {
        widget->update();
        switch(widget->get_anchor_type()) {
            case Widget::Anchor::TOP_LEFT: {
                widget->set_pos(top_left_anchor_x, top_left_anchor_y);
                // Do nothing with the x position
                top_left_anchor_y += widget->get_height() + padding;
            } break;
            case Widget::Anchor::TOP_RIGHT: {
                widget->set_pos(top_right_anchor_x - widget->get_width(), top_right_anchor_y);
                // Do nothing with the x position
                top_right_anchor_y += widget->get_height() + padding;
            } break;
            case Widget::Anchor::BOTTOM_LEFT: {
                widget->set_pos(bottom_left_anchor_x, bottom_left_anchor_y - widget->get_height());
                // Do nothing with the x position
                bottom_left_anchor_y -= widget->get_height() + padding;
            } break;
            case Widget::Anchor::BOTTOM_RIGHT: {
                // TODO: Implement
            } break;
        }
        widget->render();
    }
    reset_anchor_positions();
}