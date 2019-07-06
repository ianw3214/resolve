#pragma once

#include <vector>

class Widget;
class WidgetManager {
    
public:
    void init();
    Widget * addWidget(Widget * widget);

    bool click(int mouse_x, int mouse_y);
    void render();

private:
    std::vector<Widget*> widgets;
};