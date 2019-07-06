#include "widgetManager.hpp"
#include "widget.hpp"

#include "core/engine.hpp"

void WidgetManager::init() {
    // TOOD: No magic numbers
    QcE::get_instance()->getTextEngine()->createFont("widgets", "resources/SairaSemiCondensed-Regular.ttf", 16);
}

Widget * WidgetManager::addWidget(Widget * widget) {
    widgets.push_back(widget);
    widget->define();
    widget->resetDrawPos();
    return widget;
}

bool WidgetManager::click(int mouse_x, int mouse_y) {
    for (Widget * widget : widgets) {
        if (widget->click(mouse_x, mouse_y)) {
            return true;
        }
    }
    return false;
}

void WidgetManager::render() {
    for (Widget * widget : widgets) {
        widget->render();
    }
}